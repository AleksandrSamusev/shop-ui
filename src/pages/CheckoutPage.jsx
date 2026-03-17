import React, { useState, useEffect } from "react";
import { useBasket } from "../context/BasketContext";
import { authService } from "../services/authService";
import { MapPin, ShieldCheck, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/orderService";
import { userService } from "../services/userService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { basket, basketTotal, clearBasket } = useBasket();

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveIdentity = async () => {
      const sessionUser = authService.getCurrentUser();

      // 🛡️ 1. IDENTITY GUARD: Redirect if no session exists
      if (!sessionUser) {
        navigate("/");
        return;
      }

      // 🛡️ 2. ID VALIDATION: Ensure a valid ID exists for the database query
      if (!sessionUser.id) {
        navigate("/");
        return;
      }

      // 🛡️ 3. BASKET HYDRATION: Ensure basket isn't empty before proceeding
      if (basket.length === 0 && !loading) {
        navigate("/");
        return;
      }

      try {
        // 🚀 THE FIX: 'fullUser' is now assigned the direct return from your service
        const fullUser = await userService.getUserById(sessionUser.id);

        if (fullUser) {
          setCurrentUser(fullUser);

          // 🛡️ AUTO-SELECT: Set coordinates from the database result
          const primary = fullUser.addresses?.find((a) => a.addressType === "PRIMARY");
          if (primary) {
            setSelectedAddressId(primary.id);
          } else if (fullUser.addresses?.length > 0) {
            // Fallback: Select the first available index if no primary flag is set
            setSelectedAddressId(fullUser.addresses[0].id);
          }
        }
      } catch (error) {
        console.error("Identity Resolution Failed:", error);
        if (!loading) navigate("/");
      } finally {
        setLoading(false);
      }
    };

    resolveIdentity();
    // 🛡️ Removing 'loading' from dependencies to prevent infinite re-resolution loops
  }, [navigate, basket.length]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        addressId: selectedAddressId,
        items: basket.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      // 1. TRANSMIT: Send payload to the backend forge
      const response = await OrderService.createOrder(orderData);
      console.log("Order successfully committed to fleet logs:", response);

      // 2. PURGE: Wipe the local basket and its TTL timestamp
      // This ensures Sarah sees 0 items in her Navbar after the jump
      clearBasket();

      // 3. NAVIGATE: Exit the checkout terminal
      // In a real-world app, you might jump to a "/success" page or "My Orders"
      navigate("/", { state: { orderSuccess: true, reference: response.data.referenceCode } });
    } catch (error) {
      console.error("Transmission Error: Order could not be finalized.", error);
      // Optional: Add a toast notification here for Sarah
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🛡️ LOADING TERMINAL: High-density resolver view
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
          Resolving Coordinates...
        </p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animate-in fade-in duration-700">
      <main className="max-w-[1400px] mx-auto px-12 py-20">
        {/* HEADER: Return Navigation */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all mb-12 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Return to Showroom
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* 🛡️ LEFT COLUMN: Address Selection Grid */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
                Finalize Order
              </h1>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.3em]">
                Select delivery coordinates for your components
              </p>
            </header>

            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">
                  Shipping Coordinates
                </h3>
                <div className="h-[1px] w-full bg-blue-500/20" />
              </div>

              {currentUser.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                        selectedAddressId === addr.id
                          ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <MapPin
                          size={20}
                          className={
                            selectedAddressId === addr.id ? "text-blue-500" : "text-slate-600"
                          }
                        />
                        {selectedAddressId === addr.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        {addr.addressType}
                      </p>
                      <p className="text-sm font-bold text-white mb-1">{addr.streetAddress}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-slate-800 rounded-[3rem] text-center">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    No Coordinates Detected
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* 🛒 RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 sticky top-32 shadow-2xl shadow-black">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-10">
                Order Summary
              </h3>

              <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                {basket.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-800">
                        <img
                          src={item.imageUrl}
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[180px]">
                          {item.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                          Qty: {item.quantity} x ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-white italic">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* FINANCIALS */}
              <div className="space-y-4 border-t border-slate-800 pt-8 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-white">
                    ${basketTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Est. Shipping
                  </span>
                  <span className="text-sm font-bold text-emerald-500 uppercase">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                    Total Amount
                  </span>
                  <span className="text-4xl font-black text-white italic tracking-tighter">
                    ${basketTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-900/20"
              >
                {isSubmitting ? "Finalizing Transmission..." : "Confirm & Place Order"}
                <ArrowRight size={18} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">
                  Secured by Veloce Systems
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

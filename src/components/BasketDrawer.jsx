import { X, Trash2, Plus, Minus, ShoppingBasket, ArrowRight } from "lucide-react";
import { useBasket } from "../context/BasketContext";
import { useNavigate } from "react-router-dom";

export default function BasketDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { basket, removeFromBasket, updateQuantity, basketTotal, clearBasket } = useBasket();

  const handleProceedToCheckout = () => {
    onClose(); // 🛡️ Close the drawer first for a clean transition
    navigate("/checkout"); // 🚀 Move to the protected CheckoutPage
  };

  return (
    <>
      {/* 🚀 1. THE BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-all duration-500 ${
          isOpen ? "opacity-100 z-[400]" : "opacity-0 pointer-events-none -z-10"
        }`}
      />

      {/* 🚀 2. THE BASKET PANEL */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-500 ease-out flex flex-col z-[500] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <header className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="text-blue-500" size={24} />
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              My Basket
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </header>

        {/* SCROLLABLE ITEM LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {basket.length > 0 ? (
            basket.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex gap-4 group"
              >
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-white uppercase truncate tracking-widest">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-bold text-blue-500 mt-1">
                    $ {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:text-white text-slate-500"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-[10px] font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:text-white text-slate-500"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <ShoppingBasket size={48} className="opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Basket Empty</p>
            </div>
          )}
        </div>

        {/* FOOTER: Summary & Checkout */}
        <footer className="p-8 border-t border-slate-800 bg-slate-950/50 space-y-6">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Total Amount
            </span>
            <span className="text-3xl font-black text-white italic tracking-tighter">
              $ {basketTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout} // 🚀 LINKED: Triggers the navigation
            disabled={basket.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            Proceed to Checkout
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </aside>
    </>
  );
}

import React, { useState } from "react";
import { User as UserIcon, ShoppingBasket, Shield, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { authService } from "../../../features/auth/services/authService";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../../../features/basket/context/BasketContext"
import BasketDrawer from "../../../features/basket/components/BasketDrawer"

export default function Navbar({ onLoginClick, currentUser, onLogout }) {
  const navigate = useNavigate();

  const { basketCount, clearBasket } = useBasket();
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef(null);


  const handleLogout = () => {
    onLogout();
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  return (
    <>
      <nav className="sticky top-0 z-[150] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-12 h-[80px] flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
              <Shield className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">Space <span className="text-blue-500">Market</span></h1>
          </div>

          {/* ACTIONS: Role-Based Intelligence */}
          <div className="flex items-center gap-8">

            {/* MY BASKET BUTTON */}
            <button onClick={() => setIsBasketOpen(true)} className="relative text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
              <ShoppingBasket size={20} className="group-hover:text-blue-500 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">My Basket</span>

              {/* DYNAMIC BADGE: Live feedback for the loadout */}
              {basketCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 animate-in zoom-in duration-300 shadow-lg shadow-blue-900/40">
                  {basketCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div ref={menuRef} className="relative flex items-center pl-8 border-l border-slate-800/50">
                {/* TRIGGER */}
                <button onClick={() => setIsMenuOpen((prev) => !prev)} className="flex items-center gap-2 group">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {currentUser.email.split("@")[0]}
                    </span>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">
                      {currentUser.roles?.includes("ROLE_ADMIN")
                        ? "Admin"
                        : "User"}
                    </span>
                  </div>

                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isMenuOpen ? "rotate-180 text-white" : ""}`} />
                </button>

                {/* DROPDOWN */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    <div className="flex flex-col divide-y divide-slate-800">
                      {isAdmin && (
                        <button onClick={() => { navigate("/admin/products"); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-400 hover:bg-slate-800">Dashboard</button>
                      )}
                      {!isAdmin && (
                        <button onClick={() => { navigate("/account/orders"); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-300 hover:bg-slate-800 hover:text-white">My Account</button>
                      )}
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-400 hover:bg-slate-800">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-blue-500/50 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <UserIcon size={16} />
                Login
              </button>
            )}
          </div>



        </div>
      </nav>

      {/* THE BASKET DRAWER */}
      <BasketDrawer isOpen={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
    </>
  );
}

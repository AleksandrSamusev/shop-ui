import React from "react";
import { User as UserIcon, ShoppingCart, Shield, LogOut } from "lucide-react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

// 🚀 THE FIX: Accept 'currentUser' as a prop from Mission Control (HomePage)
export default function Navbar({ onLoginClick, currentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    // 🛡️ SYMMETRY: Hard reload ensures all caches and states are wiped clean
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-[1400px] mx-auto px-8 h-[80px] flex items-center justify-between">
        {/* BRAND: Veloce Aerospace */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
            <Shield className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
            Veloce <span className="text-blue-500">Aerospace</span>
          </h1>
        </div>

        {/* ACTIONS: Role-Based Intelligence */}
        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
            <ShoppingCart size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Fleet Cart</span>
          </button>

          {currentUser ? (
            // 🚀 THE IDENTITY CARD: Replaces the Login trigger instantly
            <div className="flex items-center gap-4 pl-8 border-l border-slate-800/50 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {/* Extract name from email for a cleaner Aero-Look */}
                  {currentUser.email.split("@")[0]}
                </span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">
                  {currentUser.roles?.includes("ROLE_ADMIN") ? "Admin Clearance" : "Fleet Member"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-inner"
                title="Terminate Session"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            // 🚀 GUEST STATE: The Security Entrance
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-blue-500/50 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <UserIcon size={16} />
              Terminal Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

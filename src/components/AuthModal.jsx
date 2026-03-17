import React, { useState } from "react";
import { X, Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom"; // 🚀 1. IMPORT THE DISPATCHER

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  // --- HOOKS MUST BE AT THE TOP ---
  const navigate = useNavigate(); // 🚀 2. INITIALIZE NAVIGATE
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Move the conditional return AFTER the hooks
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. ENGINE IGNITED - Form Data:", formData);

    setLoading(true);
    setError("");

    try {
      console.log("2. ATTEMPTING HANDSHAKE...");
      const user = await authService.login(formData.email, formData.password);
      console.log("3. DATA RECEIVED:", user);

      // 🛡️ Safe check for roles array
      const userRoles = user?.roles || [];

      if (userRoles.includes("ROLE_ADMIN")) {
        console.log("4. CLEARANCE GRANTED: Redirecting to Admin Forge");
        navigate("/admin/products");
      } else {
        console.log("4. CLEARANCE GRANTED: Staying in Showroom");
        navigate("/");
      }

      onLoginSuccess();
    } catch (err) {
      console.error("5. HANDSHAKE FAILED:", err);
      // Pull the message from our custom ResponseUtil structure
      setError(err.response?.data?.message || "SYSTEM ALERT: Terminal Connection Lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl shadow-blue-900/20 animate-in zoom-in-95 duration-300">
        {/* HEADER: Clearance Level */}
        <div className="bg-slate-950 p-8 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500 w-6 h-6" />
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {isLogin ? "Terminal Login" : "Register Asset"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-all active:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM: Security Handshake */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* 🚀 1. THE INPUT CLUSTER: Tightened to space-y-4 for high-density feel */}
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">
                  Full Identity
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-800"
                    placeholder="COMMANDER NAME"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">
                Comm-Link (Email)
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600"
                  placeholder="NAME@VELOCE.AF"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">
                Access Cipher
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ERROR HANDLER: Positioned between Cluster and Button */}
          {error && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-tight">
                {error}
              </p>
            </div>
          )}

          {/* 🚀 2. THE ACTION SECTOR: Increased margin-top for separation */}
          <div className="mt-8 space-y-6">
            <button
              disabled={loading}
              className={`w-full h-[58px] rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] shadow-xl transition-all active:scale-95 ${
                loading
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30"
              }`}
            >
              {loading ? "Verifying Cipher..." : isLogin ? "Initiate Access" : "Create Credentials"}
              {!loading && <ArrowRight size={16} className="mt-px" />}
            </button>

            <p className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              {isLogin ? "No Clearance?" : "Existing Personnel?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-500 hover:text-blue-400 hover:underline transition-colors cursor-pointer"
              >
                {isLogin ? "Request Access" : "Login Terminal"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

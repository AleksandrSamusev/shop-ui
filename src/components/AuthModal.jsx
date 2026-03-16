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
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl shadow-blue-900/20">
        {/* HEADER: Clearance Level */}
        <div className="bg-slate-950 p-8 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500 w-6 h-6" />
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {isLogin ? "Terminal Login" : "Register Asset"}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORM: Security Handshake */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Full Identity
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                <input
                  type="text"
                  required
                  className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all"
                  placeholder="COMMANDER NAME"
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Comm-Link (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input
                type="email"
                required
                className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all"
                placeholder="NAME@VELOCE.AF"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
              Access Cipher
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input
                type="password"
                required
                className="w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-tight">
                {error}
              </p>
            </div>
          )}

          <button
            disabled={loading} // Prevent spamming the API
            className={`w-full h-[56px] rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
              loading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
            }`}
          >
            {/* Show specific status during the handshake */}
            {loading ? "Verifying Cipher..." : isLogin ? "Initiate Access" : "Create Credentials"}

            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {isLogin ? "No Clearance?" : "Existing Personnel?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-500 hover:underline cursor-pointer"
            >
              {isLogin ? "Request Access" : "Login Terminal"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

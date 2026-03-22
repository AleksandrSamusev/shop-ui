import { X, Shield, Mail, Lock, User, ArrowRight, Phone } from "lucide-react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { showSuccess, showError } from "../../../shared/utils/toast";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // ✅ Reset when switching mode (FIXES YOUR BUG)
  useEffect(() => {
    setErrors({});
  }, [isLogin]);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    setErrors({});
  };

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "EMAIL REQUIRED";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "INVALID EMAIL FORMAT";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "MIN 8 CHARACTERS REQUIRED";
    }

    if (!isLogin) {
      if (!formData.firstName || formData.firstName.length < 2) {
        newErrors.firstName = "FIRST NAME TOO SHORT";
      }

      if (!formData.lastName || formData.lastName.length < 2) {
        newErrors.lastName = "LAST NAME TOO SHORT";
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "PHONE REQUIRED";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(
          formData.email,
          formData.password
        );

        showSuccess("ACCESS GRANTED");

        const userRoles = user?.roles || [];

        if (userRoles.includes("ROLE_ADMIN")) {
          navigate("/admin/products");
        } else {
          navigate("/");
        }

        onLoginSuccess();
      } else {
        await authService.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        });

        showSuccess("ACCOUNT CREATED");

        setIsLogin(true);
      }
    } catch (err) {
      showError(
        err.response?.data?.message ||
        "SYSTEM ALERT: Terminal Connection Lost."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl shadow-blue-900/20">
        {/* HEADER */}
        <div className="bg-slate-950 p-8 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500 w-6 h-6" />
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {isLogin ? "Terminal Login" : "Register Asset"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-8">
          <div className="space-y-4">
            {!isLogin && (
              <>
                <InputField
                  icon={User}
                  placeholder="FIRST NAME"
                  value={formData.firstName}
                  onChange={(e) =>
                    updateField("firstName", e.target.value)
                  }
                  error={errors.firstName}
                />

                <InputField
                  icon={User}
                  placeholder="LAST NAME"
                  value={formData.lastName}
                  onChange={(e) =>
                    updateField("lastName", e.target.value)
                  }
                  error={errors.lastName}
                />

                <InputField
                  icon={Phone}
                  placeholder="PHONE NUMBER"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateField("phoneNumber", e.target.value)
                  }
                  error={errors.phoneNumber}
                />
              </>
            )}

            <InputField
              icon={Mail}
              type="text"
              placeholder="EMAIL"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
            />

            <InputField
              icon={Lock}
              type="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
            />
          </div>

          <div className="mt-8 space-y-6">
            <button
              disabled={loading}
              className={`w-full h-[58px] rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] ${loading
                  ? "bg-slate-800 text-slate-600"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
            >
              {loading
                ? "Processing..."
                : isLogin
                  ? "Initiate Access"
                  : "Create Credentials"}
              {!loading && <ArrowRight size={16} />}
            </button>

            <p className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              {isLogin ? "No Clearance?" : "Existing Personnel?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-500 hover:underline"
              >
                {isLogin ? "Request Access" : "Login"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🔥 Stable Input */
function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="space-y-1">
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-blue-500" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full h-[52px] bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-white outline-none transition-all ${error
              ? "ring-2 ring-red-500/80"
              : "focus:ring-2 focus:ring-blue-500/60"
            }`}
          placeholder={placeholder}
        />
      </div>

      <p
        className={`text-[10px] font-bold px-1 min-h-[14px] transition-all duration-200 ${error ? "text-red-500 opacity-100" : "opacity-0"
          }`}
      >
        {error}
      </p>
    </div>
  );
}
import { useState } from "react";
import Dropdown from "../../../shared/components/ui/Dropdown";

export default function AddressForm({ onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    streetAddress: "",
    city: "",
    postalCode: "",
    countryCode: "US",
    addressType: "SHIPPING",
  });

  const [errors, setErrors] = useState({});

  const addressTypeOptions = [
    { label: "Shipping Address", value: "SHIPPING" },
    { label: "Primary (Default)", value: "PRIMARY" },
    { label: "Billing Address", value: "BILLING" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street Required";
    if (!formData.city.trim()) newErrors.city = "City Required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal Required";
    if (formData.countryCode.length !== 2)
      newErrors.countryCode = "Must be 2 letters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const inputBase =
    "w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] mb-8 animate-in fade-in zoom-in duration-300"
    >
      <div className="space-y-6">
        {/* STREET */}
        <div>
          <div className="flex justify-between mb-2 px-1">
            <label
              className={`text-[10px] font-black uppercase tracking-widest ${errors.streetAddress ? "text-red-400" : "text-slate-400"
                }`}
            >
              Street Address *
            </label>

            <span
              className={`text-[9px] px-2 py-0.5 rounded ${errors.streetAddress
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/10 text-blue-300"
                }`}
            >
              {errors.streetAddress || "e.g. 123 Java Lane"}
            </span>
          </div>

          <input
            className={`${inputBase} ${errors.streetAddress ? "border-red-500" : ""
              }`}
            value={formData.streetAddress}
            onChange={(e) => {
              setFormData({ ...formData, streetAddress: e.target.value });
              if (errors.streetAddress)
                setErrors({ ...errors, streetAddress: null });
            }}
          />
        </div>

        {/* ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CITY */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase mb-2 block">
              City *
            </label>
            <input
              className={`${inputBase} ${errors.city ? "border-red-500" : ""
                }`}
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
                if (errors.city) setErrors({ ...errors, city: null });
              }}
            />
          </div>

          {/* POSTAL */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase mb-2 block">
              Postal Code *
            </label>
            <input
              className={`${inputBase} ${errors.postalCode ? "border-red-500" : ""
                }`}
              value={formData.postalCode}
              onChange={(e) => {
                setFormData({ ...formData, postalCode: e.target.value });
                if (errors.postalCode)
                  setErrors({ ...errors, postalCode: null });
              }}
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase mb-2 block">
              Country *
            </label>
            <input
              maxLength="2"
              className={`${inputBase} uppercase ${errors.countryCode ? "border-red-500" : ""
                }`}
              value={formData.countryCode}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  countryCode: e.target.value.toUpperCase(),
                });
                if (errors.countryCode)
                  setErrors({ ...errors, countryCode: null });
              }}
            />
          </div>
        </div>

        {/* ADDRESS TYPE (FIXED) */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase mb-2 block">
            Address Type *
          </label>

          <Dropdown
            value={formData.addressType}
            options={addressTypeOptions}
            onChange={(value) =>
              setFormData({ ...formData, addressType: value })
            }
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isSaving
              ? "bg-blue-800 text-blue-300"
              : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
        >
          {isSaving ? "Processing..." : "Save Address"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
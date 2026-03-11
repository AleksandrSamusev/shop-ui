import { useState } from 'react';

export default function AddressForm({ onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    postalCode: '', // Added this
    countryCode: 'US',
    addressType: 'SHIPPING'
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Manual Validation Check
    const newErrors = {};
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street Required";
    if (!formData.city.trim()) newErrors.city = "City Required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal Required";
    if (formData.countryCode.length !== 2) newErrors.countryCode = "Must be 2 letters";

    setErrors(newErrors);

    // 2. Only call onSave if there are ZERO errors
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] mb-8 animate-in fade-in zoom-in duration-300 backdrop-blur-sm"
    >
      <div className="space-y-6">
        {/* Row 1: Street Address */}
        <div>
          <div className="flex justify-between items-end mb-2 px-1">
            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${errors.streetAddress ? 'text-red-400' : 'text-slate-400'
              }`}>
              Street Address <span className="text-red-500 font-bold">*</span>
            </label>

            {/* BADGE SWAP: Shows the Blue Hint or the Red Error */}
            <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded transition-all duration-300 ${errors.streetAddress
              ? 'bg-red-500/20 text-red-400 animate-pulse ring-1 ring-red-500/50'
              : 'bg-blue-500/20 text-blue-300'
              }`}>
              {errors.streetAddress || 'e.g. 123 Java Lane'}
            </span>
          </div>

          <input
            // REMOVE 'required' here to stop the white bubble
            className={`w-full bg-slate-900/50 border rounded-2xl p-4 text-white outline-none transition-all duration-300 ${errors.streetAddress
              ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] ring-1 ring-red-500/20'
              : 'border-slate-700 focus:border-blue-500'
              }`}
            value={formData.streetAddress}
            onChange={e => {
              setFormData({ ...formData, streetAddress: e.target.value });
              // Clear the error as soon as the user starts typing!
              if (errors.streetAddress) setErrors({ ...errors, streetAddress: null });
            }}
          />
        </div>

        {/* Row 2: City + Postal Code + Country Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CITY */}
          <div>
            <div className="flex justify-between items-end mb-2 px-1">
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${errors.city ? 'text-red-400' : 'text-slate-400'
                }`}>
                City <span className="text-red-500 font-bold">*</span>
              </label>
              {/* DYNAMIC ERROR BADGE: Hidden until needed */}
              <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded transition-all duration-300 ${errors.city
                ? 'bg-red-500/20 text-red-400 animate-pulse opacity-100'
                : 'bg-slate-700/10 text-slate-500 opacity-0' // Invisible but takes up space
                }`}>
                {errors.city || 'Required'}
              </span>
            </div>
            <input
              // REMOVE 'required' here
              className={`w-full bg-slate-900/50 border rounded-2xl p-4 text-white outline-none transition-all duration-300 ${errors.city
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : 'border-slate-700 focus:border-blue-500'
                }`}
              value={formData.city}
              onChange={e => {
                setFormData({ ...formData, city: e.target.value });
                if (errors.city) setErrors({ ...errors, city: null });
              }}
            />
          </div>

          {/* POSTAL CODE */}
          <div>
            <div className="flex justify-between items-end mb-2 px-1">
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${errors.postalCode ? 'text-red-400' : 'text-slate-400'
                }`}>
                Postal Code <span className="text-red-500 font-bold">*</span>
              </label>

              {/* DYNAMIC ERROR BADGE: Matches City/Street logic */}
              <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded transition-all duration-300 ${errors.postalCode
                ? 'bg-red-500/20 text-red-400 animate-pulse opacity-100 ring-1 ring-red-500/30'
                : 'bg-slate-700/10 text-slate-500 opacity-0'
                }`}>
                {errors.postalCode || 'Required'}
              </span>
            </div>

            <input
              // REMOVE 'required' here to use our custom validation
              className={`w-full bg-slate-900/50 border rounded-2xl p-4 text-white outline-none transition-all duration-300 ${errors.postalCode
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] ring-1 ring-red-500/20'
                : 'border-slate-700 focus:border-blue-500'
                }`}
              value={formData.postalCode}
              onChange={e => {
                setFormData({ ...formData, postalCode: e.target.value });
                if (errors.postalCode) setErrors({ ...errors, postalCode: null });
              }}
            />
          </div>

          {/* COUNTRY (Already correct, but ensure it matches) */}
          <div>
            <div className="flex justify-between items-end mb-2 px-1">
              <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${errors.countryCode ? 'text-red-400' : 'text-slate-400'
                }`}>
                Country (ISO) <span className="text-red-500 font-bold">*</span>
              </label>

              {/* BADGE SWAP: Show the Blue Hint or the Red Error */}
              <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded transition-all duration-300 ${errors.countryCode
                  ? 'bg-red-500/20 text-red-400 animate-pulse ring-1 ring-red-500/30'
                  : 'bg-blue-500/10 text-blue-300'
                }`}>
                {errors.countryCode || '2-Letters (e.g. US)'}
              </span>
            </div>

            <input
              maxLength="2"
              placeholder="--"
              className={`w-full bg-slate-900/50 border rounded-2xl p-4 text-white outline-none transition-all duration-300 uppercase placeholder:text-slate-800 ${errors.countryCode
                  ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] ring-1 ring-red-500/20'
                  : 'border-slate-700 focus:border-blue-500'
                }`}
              value={formData.countryCode}
              onChange={e => {
                setFormData({ ...formData, countryCode: e.target.value.toUpperCase() });
                if (errors.countryCode) setErrors({ ...errors, countryCode: null });
              }}
            />
          </div>
        </div>

        {/* Row 3: Address Type */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1">
            Address Type <span className="text-red-500 font-bold" aria-hidden="true">*</span>
          </label>
          <select
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all"
            value={formData.addressType}
            onChange={e => setFormData({ ...formData, addressType: e.target.value })}
          >
            <option value="SHIPPING">Shipping Address</option>
            <option value="PRIMARY">Primary (Default)</option>
            <option value="BILLING">Billing Address</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className={`flex-1 flex items-center justify-center gap-3 font-bold py-4 rounded-2xl transition-all shadow-lg 
      ${isSaving
              ? 'bg-blue-800 text-blue-300 cursor-not-allowed opacity-80'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 active:scale-[0.98]'
            }`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            'Save Address'
          )}
        </button>

        {/* RE-ADD THE CANCEL BUTTON HERE */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving} // Also disable cancel while saving to prevent state glitches
          className="px-8 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

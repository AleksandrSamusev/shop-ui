export default function FormField({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {label}
                </label>
            )}

            {children}

            {/* Reserved space prevents layout shift */}
            <div className="min-h-[14px] text-[10px] text-red-500">
                {error}
            </div>
        </div>
    );
}
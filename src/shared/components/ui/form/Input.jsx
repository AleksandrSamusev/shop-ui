export default function Input({ error, className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white outline-none ${error ? "border-red-500" : "border-slate-800"
                } ${className}`}
        />
    );
}
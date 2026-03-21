export default function Textarea({ className = "", ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full h-[180px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] font-mono text-slate-400 placeholder:text-slate-600 resize-none ${className}`}
        />
    );
}
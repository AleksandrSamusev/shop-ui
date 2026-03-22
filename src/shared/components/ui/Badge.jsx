function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-slate-800 text-slate-300",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    purple: "bg-purple-500/10 text-purple-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
// src/components/HomeHero.jsx
export default function HomeHero() {
  return (
    <section className="relative w-full py-24 overflow-hidden border-b border-slate-800/30">
      {/* 🚀 VISUAL DECORATION: The "Deep Void" Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-12 relative z-10">
        <p className="text-blue-500 text-[11px] font-black uppercase tracking-[0.4em] mb-4">
          Status: Operational // Deep Space Logistical Support
        </p>
        <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] max-w-4xl mb-8">
          Next-Gen Components <br />
          <span className="text-slate-700">Forged for the Deep Void.</span>
        </h2>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-xl leading-relaxed">
          Access the primary fleet database for mission-critical propulsion, energy storage, and
          structural shielding.
        </p>
      </div>
    </section>
  );
}

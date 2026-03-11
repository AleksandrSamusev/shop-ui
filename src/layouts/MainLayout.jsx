import { Link, useLocation, Outlet } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();

  // Helper to highlight the active link
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* --- SIDEBAR: Global Navigation --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl">
        
        {/* BRAND HEADER */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">Veloce</h2>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Dashboard</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-4 space-y-2 flex-1">
          <Link 
            to="/users" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              isActive('/users') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest">Users</span>
          </Link>

          <Link 
            to="/products" 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              isActive('/products') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest">Products</span>
          </Link>
        </nav>

        {/* SYSTEM STATUS (Bottom) */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Online</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-hidden relative">
        {/* THIS IS WHERE USERS OR PRODUCTS PAGES WILL RENDER */}
        <Outlet />
      </main>

    </div>
  );
}
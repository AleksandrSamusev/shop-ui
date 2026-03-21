import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { authService } from "../features/auth/services/authService";
import {
  LogOut,
  User as UserIcon,
  Shield,
  Home,
  Users,
  Package,
} from "lucide-react";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = authService.getCurrentUser();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col shadow-2xl">
        
        {/* BRAND HEADER */}
        <div className="p-6 border-b border-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">
                Veloce
              </h2>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] leading-none mt-1">
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2 flex-1">
          
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-900 hover:text-white group"
          >
            <Home size={16} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Home
            </span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              isActive("/admin/users")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Users size={16} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Personnel
            </span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              isActive("/admin/products")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <Package size={16} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Fleet Assets
            </span>
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col p-6">
        <Outlet />
      </main>
    </div>
  );
}
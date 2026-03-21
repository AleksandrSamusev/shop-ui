import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, MapPin, User, Home } from "lucide-react";
import { authService } from "../features/auth/services/authService";

export default function AccountLayout() {
    const location = useLocation();
    const user = authService.getCurrentUser();

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col shadow-2xl">

                {/* HEADER */}
                <div className="p-6 border-b border-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Account
                            </h2>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-1">
                                Control Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="p-4 space-y-2 flex-1">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            isActive("/")
                                ? "bg-blue-600 text-white"
                                : "text-slate-500 hover:bg-slate-900 hover:text-white"
                        }`}
                    >
                        <Home size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">
                            Home
                        </span>
                    </Link>

                    <div className="border-t border-slate-800 my-2" />

                    <Link
                        to="/account/orders"
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive("/account/orders")
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                    >
                        <Package size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">
                            Orders
                        </span>
                    </Link>

                    <Link
                        to="/account/addresses"
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                            isActive("/account/addresses")
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                    >
                        <MapPin size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">
                            Addresses
                        </span>
                    </Link>
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col p-10">
                <Outlet />
            </main>
        </div>
    );
}
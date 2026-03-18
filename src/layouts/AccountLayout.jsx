import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, MapPin, User } from "lucide-react";
import { authService } from "../services/authService";

export default function AccountLayout() {
    const location = useLocation();
    const user = authService.getCurrentUser();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">

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
                        to="/account/orders"
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive("/account/orders")
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
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${isActive("/account/addresses")
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

                {/* USER CARD */}
                <div className="p-4 border-t border-slate-900">
                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl">

                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                            <User className="text-blue-500 w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">
                                {user?.email ? user.email.split("@")[0] : "Commander"}
                            </p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                                User Access
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-y-auto p-10">
                <Outlet />
            </main>
        </div>
    );
}
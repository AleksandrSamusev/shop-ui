import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppShell({ currentUser, onLoginClick, onLogout }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Navbar
                currentUser={currentUser}
                onLoginClick={onLoginClick}
                onLogout={onLogout}
            />

            <main>
                <Outlet />
            </main>
        </div>
    );
}
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppShell({ currentUser, onLoginClick, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar currentUser={currentUser} onLoginClick={onLoginClick} onLogout={onLogout} />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="w-full flex items-center justify-between bg-white/80 border-b px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-[230px]">
        <img src="/vite.svg" alt="Logo" className="w-12 h-12 rounded-full" />
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-tight text-zinc-900">ShreeRamMithai</span>
          <span className="text-sm text-zinc-500">Traditional Indian Sweets</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="flex items-center gap-2 text-zinc-700">
              <span className="inline-flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 inline-block"><circle cx="12" cy="8" r="4" stroke="#fd6b2e" strokeWidth="2"/><path d="M4 20c0-2.761 3.582-5 8-5s8 2.239 8 5" stroke="#fd6a22" strokeWidth="2"/></svg>
                {user.name || 'User'}
              </span>
              {user.role === "ADMIN" && <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded ml-2">Admin</span>}
            </span>
            {user.role === "ADMIN" ? (
              <Button variant="outline" onClick={() => nav("/admin")}
                className="font-semibold ml-1 hidden md:block">Admin Dashboard</Button>
            ) : null}
            <Button variant="ghost" onClick={() => { logout(); nav("/login"); }}>Logout</Button>
          </>
        ) : (
          <>
            {pathname !== "/login" && <Link to="/login"><Button variant="outline">Sign In</Button></Link>}
            {pathname !== "/register" && <Link to="/register"><Button>Create Account</Button></Link>}
          </>
        )}
      </div>
    </nav>
  );
}


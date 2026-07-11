import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Compass, LayoutDashboard, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-dark-border bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
                NexalQ
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-350 hover:text-slate-100 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-rose-450 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-305 hover:text-slate-100 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="glow-btn rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5.5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-500 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

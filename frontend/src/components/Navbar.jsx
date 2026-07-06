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
    <nav className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-300 via-brand-500 to-purple-400">
                StartSmart AI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  <div className="h-8 w-8 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-300 font-bold text-sm">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="glow-btn rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-all"
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

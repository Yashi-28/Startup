import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
  const { login, loginWithGoogle, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (response) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If already logged in, redirect immediately
    if (token) {
      navigate('/dashboard');
      return;
    }

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE",
          callback: handleGoogleLogin
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "380",
            text: "signin_with",
            logo_alignment: "left"
          }
        );
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector('script[src*="gsi/client"]');
      if (script) {
        script.addEventListener('load', initGoogle);
      }
    }

    return () => {
      const script = document.querySelector('script[src*="gsi/client"]');
      if (script) {
        script.removeEventListener('load', initGoogle);
      }
    };
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 relative overflow-hidden bg-grid-pattern flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute top-[-10%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-brand-500/5 blur-[100px] -z-10" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30rem] h-[30rem] rounded-full bg-purple-500/5 blur-[100px] -z-10" />

        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-dark-border/80 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-brand-600/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight text-center">
              Welcome back
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Access your evaluation tools and business mentor.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glow-btn flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-500/20"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border/40"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#151c2c] px-3 text-gray-500 font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in button */}
          <div className="w-full flex justify-center">
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-[10px] text-gray-500">
        &copy; {new Date().getFullYear()} StartSmart AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

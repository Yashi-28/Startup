import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const { register, loginWithGoogle, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
          document.getElementById("google-signup-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "380",
            text: "signup_with",
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

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Failed to register. Username or email might be in use.");
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
              Create an account
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Start evaluating startup concepts with AI.
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
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="•••••••• (min 6 chars)"
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
                  Create Account <ArrowRight className="h-4 w-4" />
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
            <div id="google-signup-btn" className="w-full flex justify-center"></div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign In
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

export default Register;

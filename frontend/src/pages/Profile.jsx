import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, Key, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Profile & Account</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your developer credentials and access details.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-dark-border/60">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-dark-border/60">
              <div className="h-20 w-20 rounded-full bg-brand-600/20 border border-brand-500/50 flex items-center justify-center text-brand-300 font-extrabold text-3xl">
                {user?.username ? user.username[0].toUpperCase() : 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white">{user?.username}</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Account
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4 p-4 bg-dark-bg/40 rounded-2xl border border-dark-border/40">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Username</span>
                    <span className="text-sm font-semibold text-white">{user?.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-dark-bg/40 rounded-2xl border border-dark-border/40">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Email Address</span>
                    <span className="text-sm font-semibold text-white">{user?.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-dark-bg/40 rounded-2xl border border-dark-border/40">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Joined On</span>
                    <span className="text-sm font-semibold text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-dark-bg/40 rounded-2xl border border-dark-border/40">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Security</span>
                    <span className="text-sm font-semibold text-white">JWT Access Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

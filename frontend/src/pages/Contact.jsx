import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Phone className="h-8 w-8 text-indigo-400" /> Contact Project Author
            </h1>
            <p className="text-sm text-slate-405 mt-1">Get in touch with the creator of this Startup Success Prediction system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Contact Card */}
            <div className="md:col-span-5 glass-panel p-6 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#111827] to-[#0B0F19]/40 shadow-sm">
              <div className="absolute top-0 right-0 bg-indigo-950/60 text-indigo-400 border-l border-b border-indigo-900 text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                Author
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Utkarsh Kumar</h3>
                  <p className="text-xs text-indigo-400 font-bold mt-1">Lead AI Engineer & Full Stack Developer</p>
                </div>

                <div className="space-y-4 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                    <span>utkarsh.kumar@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                    <span>New Delhi, India</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8 border-t border-slate-800 pt-6 flex gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 hover:text-indigo-300 bg-slate-900/40 text-slate-500 transition-all">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 hover:text-indigo-300 bg-slate-900/40 text-slate-500 transition-all">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="md:col-span-7 glass-panel p-6 border border-slate-800/80 shadow-sm bg-[#111827]/40">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" /> Send a Message
              </h3>

              {submitted ? (
                <div className="bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 p-5 rounded-xl flex items-start gap-3 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Inquiry Sent Successfully</h4>
                    <p className="text-[11px] text-emerald-450 mt-1">Thank you for your message! Utkarsh will get back to you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="block w-full px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Your Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. john@example.com"
                      className="block w-full px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      required
                      rows="4"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Discuss collaboration, feature requests, or algorithm feedback..."
                      className="block w-full px-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-650"
                    />
                  </div>

                  <button
                    type="submit"
                    className="glow-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/10 mt-2"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="py-12 border-t border-slate-800/60 text-center text-xs text-slate-500 mt-12 bg-[#090D16] rounded-3xl p-6 shadow-sm border border-slate-800/80">
            <div className="max-w-md mx-auto border-t border-dashed border-slate-800 pt-6 space-y-1">
              <p className="font-bold text-slate-400">Developed by Utkarsh Kumar</p>
              <p className="text-slate-550">Startup Success Prediction System</p>
              <p className="text-[10px] text-slate-655 font-bold uppercase tracking-wider mt-1">Powered by Machine Learning</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Contact;

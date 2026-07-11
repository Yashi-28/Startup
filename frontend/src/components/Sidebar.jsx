import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, TrendingUp, Info, PhoneCall, Brain } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/evaluate-form', label: 'Prediction', icon: BarChart3 },
    { to: '/dashboard', label: 'Analytics', icon: TrendingUp }, // Dashboard represents portfolio analytics
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-850 min-h-[calc(100vh-64px)] hidden md:block">
      <div className="flex flex-col gap-1.5 p-4 sticky top-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500/10 text-white border-l-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border-l-4 border-transparent'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}

        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-slate-800/80 relative overflow-hidden">
          <div className="relative z-10">
            <Brain className="h-7 w-7 text-indigo-400 mb-2 animate-float" />
            <h5 className="text-[10px] font-extrabold text-slate-200 uppercase tracking-wider mb-1">AI Business Mentor</h5>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
              Consult our advanced AI agent for interactive suggestions on SWOT models and custom canvas setups.
            </p>
            <NavLink
              to="/mentor-chat"
              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-405 hover:text-indigo-300 transition-colors"
            >
              Consult Mentor &rarr;
            </NavLink>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 rounded-full bg-indigo-500/5 blur-xl" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

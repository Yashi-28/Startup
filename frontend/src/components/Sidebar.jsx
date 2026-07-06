import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, MessageSquare, User, Compass, Brain } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/evaluate-form', label: 'Evaluate Idea', icon: FileSpreadsheet },
    { to: '/mentor-chat', label: 'Mentor Chat', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-dark-card/30 border-r border-dark-border/65 min-h-[calc(100vh-64px)] hidden md:block">
      <div className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-dark-border/40'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}

        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-brand-900/40 to-purple-950/20 border border-brand-800/40 relative overflow-hidden">
          <div className="relative z-10">
            <Brain className="h-8 w-8 text-brand-400 mb-2" />
            <h5 className="text-xs font-bold text-gray-200 mb-1">Need help?</h5>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Ask your AI Business Mentor for growth strategies.
            </p>
            <NavLink
              to="/mentor-chat"
              className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-300 hover:text-brand-200 transition-colors"
            >
              Start Chatting &rarr;
            </NavLink>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 rounded-full bg-brand-500/10 blur-xl" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

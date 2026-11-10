import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  User,
  LogOut,
  BrainCircuit,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isSidebarOpen = true, toggleSidebar }) => {
  const { logout } = useAuth();

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/60 transform transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-200/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <BrainCircuit className="text-white" size={20} strokeWidth={2} />
        </div>
        <span className="font-semibold text-slate-900">AI Assistant</span>
      </div>

      {/* Links */}
      <nav className="px-4 py-6 space-y-1">
        {navLinks.map(({ to, icon: Icon, text }) => (
          <NavLink
            key={to}
            to={to}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            {text}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200/60">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
        >
          <LogOut size={20} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
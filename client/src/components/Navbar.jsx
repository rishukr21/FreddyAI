import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  CalendarClock,
  PlusCircle,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenLogModal, onOpenAuthModal }) {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & AI', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Vault', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'interviews', label: 'Interview Vault', icon: Briefcase },
    { id: 'timeline', label: 'Journey Timeline', icon: CalendarClock },
  ];

  const handleLogClick = () => {
    if (!isAuthenticated) {
      onOpenAuthModal();
    } else {
      onOpenLogModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">Freddy<span className="text-emerald-400">AI</span></span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Placement Tracker
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">AI-Driven Coding & Placement Journal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Auth & Log Button */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{user.targetRole || 'Candidate'}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In / Register</span>
              </button>
            )}

            <button
              onClick={handleLogClick}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md shadow-emerald-500/25 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Log Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-gray-800/60 px-2 py-1.5 gap-1 bg-[#0f1422]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:bg-gray-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}

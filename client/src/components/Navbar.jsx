import React from 'react';
import { 
  Flame, 
  LayoutDashboard, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  CalendarClock,
  Plus,
  LogIn,
  LogOut,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './common/ThemeToggle';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenLogModal, 
  onOpenAuthModal,
  onOpenCommandPalette 
}) {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Vault', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'interviews', label: 'Interviews', icon: Briefcase },
    { id: 'timeline', label: 'Timeline', icon: CalendarClock },
  ];

  const handleLogClick = () => {
    if (!isAuthenticated) {
      onOpenAuthModal();
    } else {
      onOpenLogModal();
    }
  };

  return (
    <>
      {/* ================= DESKTOP & MOBILE TOP HEADER ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer shrink-0" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-amber-glow">
                <Flame className="w-5 h-5 text-black fill-black stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-foreground font-heading">
                  Freddy<span className="text-amber-500">AI</span>
                </span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-chip bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                  Tracker
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-surface-elevated/70 p-1.5 rounded-xl border border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    type="button"
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-chip text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-black font-semibold shadow-sm'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-foreground-muted'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Cmd+K Search trigger */}
              {onOpenCommandPalette && (
                <button
                  onClick={onOpenCommandPalette}
                  type="button"
                  aria-label="Open command palette"
                  className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-chip border border-border bg-surface text-foreground-muted hover:text-foreground hover:border-border-focus text-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-foreground-secondary font-mono">⌘K</span>
                </button>
              )}

              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle />

              {/* User Profile / Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold font-heading">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">{user.name}</p>
                      <p className="text-[10px] text-foreground-muted leading-tight truncate max-w-[120px]">{user.targetRole || 'Candidate'}</p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    type="button"
                    className="p-2 rounded-chip bg-surface hover:bg-surface-elevated border border-border text-foreground-muted hover:text-rose-500 transition-colors"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip text-xs font-semibold bg-surface hover:bg-surface-elevated border border-border text-foreground transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Desktop "+ Log Today" button */}
              <button
                onClick={handleLogClick}
                type="button"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log Today</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM TAB BAR ================= */}
      <nav 
        aria-label="Mobile navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border px-3 py-2 flex items-center justify-around shadow-lg transition-colors"
      >
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                isActive ? 'text-amber-500 font-semibold' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating Log Action */}
        <div className="relative -top-4">
          <button
            onClick={handleLogClick}
            type="button"
            aria-label="Log today's activity"
            className="w-13 h-13 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center shadow-amber-glow border-2 border-surface transition-transform active:scale-90"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              type="button"
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                isActive ? 'text-amber-500 font-semibold' : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

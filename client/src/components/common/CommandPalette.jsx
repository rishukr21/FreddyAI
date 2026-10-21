import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { 
  LayoutDashboard, 
  Code2, 
  FolderGit2, 
  Briefcase, 
  CalendarClock, 
  PlusCircle, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  Sparkles,
  Search,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function CommandPalette({
  isOpen,
  onClose,
  setActiveTab,
  onOpenLogModal,
  onOpenAuthModal
}) {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (action) => {
    action();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="FreddyAI Command Menu" className="w-full">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface-subtle">
            <Search className="w-4 h-4 text-amber-500 mr-3 shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or jump to page... (e.g. 'log', 'dsa')"
              className="w-full bg-transparent text-sm text-foreground placeholder-foreground-muted focus:outline-none"
              autoFocus
            />
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-foreground-muted border border-border">
              ESC
            </span>
          </div>

          {/* Results List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-8 text-center text-xs text-foreground-muted">
              No matching commands found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="⚡ Quick Actions" className="text-[11px] font-bold text-foreground-muted px-2 py-1.5 uppercase tracking-wider">
              <Command.Item
                onSelect={() => handleSelect(() => {
                  if (!isAuthenticated) onOpenAuthModal();
                  else onOpenLogModal();
                })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-amber-500 hover:text-black cursor-pointer transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-black/20 group-hover:text-black flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Log Today's Progress</div>
                  <div className="text-[11px] opacity-70">Record hours, DSA count, and boost your streak</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated group-hover:bg-black/20 text-foreground-muted group-hover:text-black">
                  Enter
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('dsa'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-amber-500 hover:text-black cursor-pointer transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 group-hover:bg-black/20 group-hover:text-black flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Vault a Solved Problem</div>
                  <div className="text-[11px] opacity-70">Add question to spaced repetition schedule</div>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="📍 Navigation" className="text-[11px] font-bold text-foreground-muted px-2 py-1.5 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('dashboard'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>Dashboard & Heatmap</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('dsa'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <Code2 className="w-4 h-4 text-teal-500" />
                <span>DSA Problem Vault & Spaced Repetition</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('projects'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <FolderGit2 className="w-4 h-4 text-amber-500" />
                <span>Projects Showcase</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('interviews'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <Briefcase className="w-4 h-4 text-teal-500" />
                <span>Interview Experience Vault</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => setActiveTab('timeline'))}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <CalendarClock className="w-4 h-4 text-amber-500" />
                <span>Career Placement Timeline</span>
              </Command.Item>
            </Command.Group>

            {/* Preferences & System */}
            <Command.Group heading="⚙️ Preferences & Session" className="text-[11px] font-bold text-foreground-muted px-2 py-1.5 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => handleSelect(toggleTheme)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Switch to Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-teal-500" />
                    <span>Switch to Dark Theme</span>
                  </>
                )}
              </Command.Item>

              {isAuthenticated ? (
                <Command.Item
                  onSelect={() => handleSelect(logout)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Command.Item>
              ) : (
                <Command.Item
                  onSelect={() => handleSelect(onOpenAuthModal)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-amber-500 hover:bg-amber-500/10 cursor-pointer transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface-subtle text-[11px] text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <span>Navigation:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px]">↓</kbd>
              <span>Select:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[10px]">↵</kbd>
            </div>
            <span>FreddyAI Quick Bar</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

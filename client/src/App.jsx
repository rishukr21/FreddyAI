import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DsaTracker from './components/DsaTracker';
import ProjectsShowcase from './components/ProjectsShowcase';
import InterviewArchive from './components/InterviewArchive';
import Timeline from './components/Timeline';
import LogModal from './components/LogModal';
import AuthModal from './components/AuthModal';
import CommandPalette from './components/common/CommandPalette';

function MainApp() {
  const { user, token, authFetch, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Data state
  const [overview, setOverview] = useState(null);
  const [stats, setStats] = useState(null);
  const [dsaProblems, setDsaProblems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (user?.leetcodeUsername) params.append('leetcode', user.leetcodeUsername);
      if (user?.codeforcesUsername) params.append('codeforces', user.codeforcesUsername);
      if (user?.githubUsername) params.append('github', user.githubUsername);
      const queryStr = params.toString() ? `?${params.toString()}` : '';

      const [ovRes, statsRes, dsaRes, projRes, intRes, logsRes] = await Promise.all([
        authFetch('/api/overview').then(r => r.json()).catch(() => null),
        authFetch(`/api/external-stats${queryStr}`).then(r => r.json()).catch(() => null),
        authFetch('/api/dsa').then(r => r.json()).catch(() => null),
        authFetch('/api/projects').then(r => r.json()).catch(() => null),
        authFetch('/api/interviews').then(r => r.json()).catch(() => null),
        authFetch('/api/logs').then(r => r.json()).catch(() => null),
      ]);

      if (ovRes?.success) setOverview(ovRes.data);
      if (statsRes?.success) setStats(statsRes.data);
      if (dsaRes?.success) setDsaProblems(dsaRes.data);
      if (projRes?.success) setProjects(projRes.data);
      if (intRes?.success) setInterviews(intRes.data);
      if (logsRes?.success) setLogs(logsRes.data);
    } catch (err) {
      console.error('Error fetching FreddyAI data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token, user]);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogSuccess = (newLog) => {
    fetchAllData();
    setActiveTab('dashboard');
  };

  const handleOpenLogModal = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsLogModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenLogModal={handleOpenLogModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area: pb-24 for mobile bottom bar clearance */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {loading && !overview ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-sm font-heading text-foreground-secondary">Loading your placement workspace...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                overview={overview} 
                stats={stats} 
                onOpenLogModal={handleOpenLogModal}
                setActiveTab={setActiveTab}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'dsa' && (
              <DsaTracker 
                problems={dsaProblems} 
                onProblemAdded={fetchAllData}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsShowcase 
                projects={projects} 
                onProjectAdded={fetchAllData}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'interviews' && (
              <InterviewArchive 
                interviews={interviews} 
                onInterviewAdded={fetchAllData}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'timeline' && (
              <Timeline 
                logs={logs} 
                onOpenLogModal={handleOpenLogModal}
              />
            )}
          </>
        )}
      </main>

      {/* Interactive Daily Log Modal */}
      <LogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onLogSuccess={handleLogSuccess}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={fetchAllData}
      />

      {/* Cmd+K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onOpenLogModal={handleOpenLogModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-surface/50 py-6 text-center text-xs text-foreground-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">FreddyAI</span>
            <span>—</span>
            <span>Placement & Coding Journey Tracker</span>
          </div>
          <p className="text-foreground-secondary font-mono text-[11px]">
            Designed with <span className="text-amber-500 font-semibold">Ink & Amber Aesthetic</span>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

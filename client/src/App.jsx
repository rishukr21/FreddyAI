import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DsaTracker from './components/DsaTracker';
import ProjectsShowcase from './components/ProjectsShowcase';
import InterviewArchive from './components/InterviewArchive';
import Timeline from './components/Timeline';
import LogModal from './components/LogModal';
import AuthModal from './components/AuthModal';

function MainApp() {
  const { user, token, authFetch, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
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
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenLogModal={handleOpenLogModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !overview ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-sm font-mono text-gray-400">Loading FreddyAI placement dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                overview={overview} 
                stats={stats} 
                onOpenLogModal={handleOpenLogModal}
                setActiveTab={setActiveTab}
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

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950/60 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-gray-300">FreddyAI</span>
            <span>—</span>
            <span>Personal Placement & Coding Journey Platform</span>
          </div>
          <p className="text-gray-400 font-mono">
            Powered by <span className="text-emerald-400 font-semibold">MERN Stack + Multi-User JWT Auth</span>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

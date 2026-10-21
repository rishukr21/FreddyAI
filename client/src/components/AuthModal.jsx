import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, AlertCircle, Lock, Mail, User, Briefcase, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  
  // Sign in fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          targetRole,
          leetcodeUsername,
          codeforcesUsername,
          githubUsername
        });
      }
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border p-6 sm:p-8 relative shadow-2xl bg-surface max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close authentication modal"
          className="absolute top-5 right-5 text-foreground-muted hover:text-foreground p-2 rounded-xl bg-surface-elevated border border-border/50 hover:border-border transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-black mx-auto mb-3 shadow-amber-glow">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 id="auth-modal-title" className="text-2xl font-bold text-foreground font-heading">
            Freddy<span className="text-amber-500">AI</span>
          </h3>
          <p className="text-xs text-foreground-secondary mt-1">
            {mode === 'signin' 
              ? 'Sign in to access your placement dashboard & AI coach' 
              : 'Create an account to track your coding journey & readiness'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-surface-subtle p-1 rounded-xl border border-border mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="name@university.edu or email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                required
                minLength={6}
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Target Placement Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. SDE-1, Full Stack Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-foreground-muted block">
                  Competitive Handles (Optional Live Sync)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="LeetCode username"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    className="w-full px-2.5 py-2 bg-surface-subtle border border-border rounded-lg text-xs text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Codeforces handle"
                    value={codeforcesUsername}
                    onChange={(e) => setCodeforcesUsername(e.target.value)}
                    className="w-full px-2.5 py-2 bg-surface-subtle border border-border rounded-lg text-xs text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="GitHub username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full px-2.5 py-2 bg-surface-subtle border border-border rounded-lg text-xs text-foreground placeholder-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-black shadow-amber-glow active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create My Account
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

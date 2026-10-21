import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Edit2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';

export default function ConnectProfilesCard({ stats, onRefresh }) {
  const { user, updateProfile, isAuthenticated } = useAuth();

  // Local state for connecting handles
  const [editingPlatform, setEditingPlatform] = useState(null); // 'leetcode' | 'codeforces' | 'github' | null
  const [lcInput, setLcInput] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [ghInput, setGhInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const leetcode = stats?.leetcode;
  const codeforces = stats?.codeforces;
  const github = stats?.github;

  const handleSave = async (platform) => {
    setLoading(true);
    setStatusMsg('');
    try {
      let payload = {};
      if (platform === 'leetcode') payload.leetcodeUsername = lcInput.trim();
      if (platform === 'codeforces') payload.codeforcesUsername = cfInput.trim();
      if (platform === 'github') payload.githubUsername = ghInput.trim();

      if (isAuthenticated && updateProfile) {
        await updateProfile(payload);
      } else {
        // Fallback for guest mode in localStorage
        const stored = JSON.parse(localStorage.getItem('freddyai_guest_handles') || '{}');
        const updated = { ...stored, ...payload };
        localStorage.setItem('freddyai_guest_handles', JSON.stringify(updated));
      }

      setEditingPlatform(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setStatusMsg(err.message || 'Failed to update handle');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (platform, currentVal = '') => {
    if (platform === 'leetcode') setLcInput(currentVal || '');
    if (platform === 'codeforces') setCfInput(currentVal || '');
    if (platform === 'github') setGhInput(currentVal || '');
    setEditingPlatform(platform);
  };

  return (
    <div id="connect-profiles-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-bold text-foreground">
            Competitive & Code Sync
          </h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Connect your handles to automatically sync solve counts, ratings, and active repositories.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* ================= 1. LEETCODE CARD ================= */}
        <Card className="flex flex-col justify-between border-amber-500/20 hover:border-amber-500/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 font-mono text-sm">
                  LC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground font-heading">LeetCode</h4>
                  <p className="text-xs text-foreground-muted">
                    {leetcode?.configured ? `@${leetcode.username}` : 'Not connected'}
                  </p>
                </div>
              </div>

              {leetcode?.configured && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit('leetcode', leetcode.username)}
                    type="button"
                    title="Change handle"
                    className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href={`https://leetcode.com/${leetcode.username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded text-foreground-muted hover:text-amber-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Content: Form or Stats */}
            {(!leetcode?.configured || editingPlatform === 'leetcode') ? (
              <div className="py-2 space-y-3">
                <p className="text-xs text-foreground-secondary">
                  Enter your LeetCode username to sync problem breakdowns and ranking:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. rishukr21"
                    value={lcInput}
                    onChange={(e) => setLcInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-chip bg-surface-elevated border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleSave('leetcode')}
                    disabled={loading || !lcInput.trim()}
                    type="button"
                    className="px-3 py-1.5 rounded-chip text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black disabled:opacity-50 transition-all shrink-0"
                  >
                    {loading ? '...' : 'Connect'}
                  </button>
                </div>
                {editingPlatform === 'leetcode' && (
                  <button
                    onClick={() => setEditingPlatform(null)}
                    type="button"
                    className="text-[11px] text-foreground-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground font-heading">{leetcode.totalSolved}</span>
                    <span className="text-xs text-foreground-muted ml-1.5">Solved</span>
                  </div>
                  {leetcode.ranking && (
                    <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-chip border border-amber-500/30">
                      Top {Math.round(leetcode.ranking / 1000)}k Rank
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-emerald-500 block">Easy</span>
                    <span className="text-sm font-bold text-foreground font-mono">{leetcode.easySolved}</span>
                  </div>
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-amber-500 block">Medium</span>
                    <span className="text-sm font-bold text-foreground font-mono">{leetcode.mediumSolved}</span>
                  </div>
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-rose-500 block">Hard</span>
                    <span className="text-sm font-bold text-foreground font-mono">{leetcode.hardSolved}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* ================= 2. CODEFORCES CARD ================= */}
        <Card className="flex flex-col justify-between border-teal-500/20 hover:border-teal-500/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-500 font-mono text-sm">
                  CF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground font-heading">Codeforces</h4>
                  <p className="text-xs text-foreground-muted">
                    {codeforces?.configured ? `@${codeforces.handle}` : 'Not connected'}
                  </p>
                </div>
              </div>

              {codeforces?.configured && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit('codeforces', codeforces.handle)}
                    type="button"
                    title="Change handle"
                    className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href={`https://codeforces.com/profile/${codeforces.handle}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded text-foreground-muted hover:text-teal-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {(!codeforces?.configured || editingPlatform === 'codeforces') ? (
              <div className="py-2 space-y-3">
                <p className="text-xs text-foreground-secondary">
                  Enter your Codeforces handle to display live contest rating:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. tourist"
                    value={cfInput}
                    onChange={(e) => setCfInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-chip bg-surface-elevated border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => handleSave('codeforces')}
                    disabled={loading || !cfInput.trim()}
                    type="button"
                    className="px-3 py-1.5 rounded-chip text-xs font-bold bg-teal-500 hover:bg-teal-600 text-black disabled:opacity-50 transition-all shrink-0"
                  >
                    {loading ? '...' : 'Connect'}
                  </button>
                </div>
                {editingPlatform === 'codeforces' && (
                  <button
                    onClick={() => setEditingPlatform(null)}
                    type="button"
                    className="text-[11px] text-foreground-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground font-heading">{codeforces.rating}</span>
                    <span className="text-xs text-foreground-muted ml-1.5">Rating</span>
                  </div>
                  <span className="text-xs font-mono font-bold capitalize text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-chip border border-teal-500/30">
                    {codeforces.rank}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">Max Rating</span>
                    <span className="text-sm font-bold text-foreground font-mono">{codeforces.maxRating}</span>
                  </div>
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">Max Title</span>
                    <span className="text-sm font-bold text-teal-500 font-mono capitalize">{codeforces.maxRank}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* ================= 3. GITHUB CARD ================= */}
        <Card className="flex flex-col justify-between border-border hover:border-foreground-secondary/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center font-bold text-foreground font-mono text-sm">
                  GH
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground font-heading">GitHub</h4>
                  <p className="text-xs text-foreground-muted">
                    {github?.configured ? `@${github.username}` : 'Not connected'}
                  </p>
                </div>
              </div>

              {github?.configured && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit('github', github.username)}
                    type="button"
                    title="Change handle"
                    className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <a 
                    href={`https://github.com/${github.username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {(!github?.configured || editingPlatform === 'github') ? (
              <div className="py-2 space-y-3">
                <p className="text-xs text-foreground-secondary">
                  Enter your GitHub username to show repository and follower count:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. rishukr21"
                    value={ghInput}
                    onChange={(e) => setGhInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-chip bg-surface-elevated border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground"
                  />
                  <button
                    onClick={() => handleSave('github')}
                    disabled={loading || !ghInput.trim()}
                    type="button"
                    className="px-3 py-1.5 rounded-chip text-xs font-bold bg-foreground text-background disabled:opacity-50 transition-all shrink-0"
                  >
                    {loading ? '...' : 'Connect'}
                  </button>
                </div>
                {editingPlatform === 'github' && (
                  <button
                    onClick={() => setEditingPlatform(null)}
                    type="button"
                    className="text-[11px] text-foreground-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground font-heading">{github.publicRepos}</span>
                    <span className="text-xs text-foreground-muted ml-1.5">Repositories</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground-secondary bg-surface-elevated px-2 py-0.5 rounded-chip border border-border">
                    {github.followers} Followers
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-center">
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">Profile State</span>
                    <span className="text-xs font-semibold text-emerald-500 font-mono">Synchronized</span>
                  </div>
                  <div className="bg-surface-elevated/70 p-2 rounded-lg border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-foreground-muted block">Dev Portfolio</span>
                    <span className="text-xs font-semibold text-foreground-secondary font-mono">Active</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}

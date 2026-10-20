import React from 'react';
import { 
  Sparkles, 
  Flame, 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Code2,
  GitCommit,
  BookOpen,
  Award,
  Clock,
  PlusCircle
} from 'lucide-react';

export default function Dashboard({ overview, stats, onOpenLogModal, setActiveTab }) {
  const latestLog = overview?.latestLog;
  const aiScore = latestLog?.aiScore;
  const hasLogs = !!latestLog;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreTier = (score) => {
    if (score >= 90) return 'Top 5% Placement Ready (Google / Atlassian Tier)';
    if (score >= 80) return 'Strong Candidate (Amazon / Microsoft Tier)';
    if (score >= 65) return 'Competitive Tier (Product Companies)';
    return 'Building Foundations';
  };

  const leetcode = stats?.leetcode;
  const codeforces = stats?.codeforces;
  const github = stats?.github;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Metrics Counter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-emerald-500/20">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Active Streak</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono flex items-center gap-2">
              {overview?.streakDays || 0} <span className="text-sm font-sans text-gray-400 font-normal">days</span>
            </h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              {overview?.streakDays > 0 ? 'Daily momentum active' : 'Start your streak today'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* DSA Solved */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">DSA Vaulted</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">
              {overview?.totalDsaProblems || 0} <span className="text-sm font-sans text-gray-400 font-normal">problems</span>
            </h3>
            <p className="text-xs text-blue-400 mt-1 font-medium flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" /> High-frequency questions
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Mock & Real Interviews */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Interview Rounds</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">
              {overview?.totalInterviews || 0} <span className="text-sm font-sans text-gray-400 font-normal">logged</span>
            </h3>
            <p className="text-xs text-purple-400 mt-1 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Interview experiences
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Study Hours Today */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Today's Focus</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">
              {latestLog?.studyHours || 0} <span className="text-sm font-sans text-gray-400 font-normal">hrs</span>
            </h3>
            <p className="text-xs text-cyan-400 mt-1 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Study + Dev output
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Hero: AI Daily Readiness Score */}
      {!hasLogs ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-emerald-950/20 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome to FreddyAI Placement Tracker
            </h2>
            <p className="text-sm text-gray-400">
              No daily activities logged yet. Click <span className="text-emerald-400 font-semibold">Log Today</span> to record your first coding session, and FreddyAI will immediately compute your baseline placement readiness score!
            </p>
          </div>
          <div>
            <button
              onClick={onOpenLogModal}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Log Your First Activity
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-emerald-950/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <BrainCircuit className="w-3.5 h-3.5" />
                FreddyAI Daily Evaluation Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Placement Readiness Scorecard
              </h2>
              <p className="text-sm text-gray-400">
                Evaluated based on today's algorithm difficulty, consistency, CS depth, and engineering deliverables.
              </p>
            </div>

            {/* Big Circular Score Pill */}
            <div className="flex items-center gap-4 bg-gray-950/70 p-4 rounded-2xl border border-gray-800">
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border font-mono font-black ${getScoreColor(aiScore.totalScore)}`}>
                <span className="text-3xl leading-none">{aiScore.totalScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">/ 100</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Placement Tier</span>
                <p className="text-sm font-bold text-white mt-0.5">{getScoreTier(aiScore.totalScore)}</p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Updated for {latestLog.date}
                </p>
              </div>
            </div>
          </div>

          {/* Score Breakdown Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/80">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Problem Solving Depth</span>
                <span className="text-emerald-400 font-mono">{aiScore.breakdown?.problemSolving || 0} / 40</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((aiScore.breakdown?.problemSolving || 0) / 40) * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/80">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>CS Depth & Fundamentals</span>
                <span className="text-cyan-400 font-mono">{aiScore.breakdown?.depthAndFundamentals || 0} / 25</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((aiScore.breakdown?.depthAndFundamentals || 0) / 25) * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/80">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Topic Diversity</span>
                <span className="text-purple-400 font-mono">{aiScore.breakdown?.breadthOfTopics || 0} / 15</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((aiScore.breakdown?.breadthOfTopics || 0) / 15) * 100)}%` }}></div>
              </div>
            </div>

            <div className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/80">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Consistency Rhythm</span>
                <span className="text-amber-400 font-mono">{aiScore.breakdown?.consistency || 7} / 10</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${((aiScore.breakdown?.consistency || 7) / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* AI Recommendations & Tomorrow Targets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            
            {/* Analysis & Recommendation */}
            <div className="space-y-4">
              <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Coach Assessment
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed font-normal">
                  "{aiScore.recommendation}"
                </p>
              </div>

              {/* Strengths */}
              {aiScore.strengths && aiScore.strengths.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs uppercase font-semibold text-gray-400">Key Strengths Observed</h5>
                  <div className="space-y-1.5">
                    {aiScore.strengths.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tomorrow's Action Plan */}
            <div className="bg-gray-950/60 p-5 rounded-2xl border border-gray-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                    <Target className="w-4 h-4" /> Tomorrow's High-Impact Targets
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">Auto-Generated</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  FreddyAI prioritized these topics to patch gaps before upcoming interview rounds:
                </p>
                <div className="space-y-2.5">
                  {(aiScore.tomorrowTarget || []).map((target, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-200 hover:border-cyan-500/40 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">Ready to record today's sessions?</span>
                <button
                  onClick={onOpenLogModal}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  Log New Activity →
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* External Stats Row (LeetCode, Codeforces, GitHub) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Competitive Profiles & External Sync</h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 font-mono">Live Sync</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* LeetCode Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 font-mono text-sm">
                  LC
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">LeetCode</h4>
                  <p className="text-xs text-gray-400">{leetcode?.configured ? `@${leetcode.username}` : 'Not Connected'}</p>
                </div>
              </div>
              {leetcode?.configured && (
                <a 
                  href={`https://leetcode.com/${leetcode.username}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {leetcode?.configured ? (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-white font-mono">{leetcode.totalSolved}</span>
                    <span className="text-xs text-gray-400 ml-1.5">Solved</span>
                  </div>
                  {leetcode.ranking && (
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Top {Math.round(leetcode.ranking / 1000)}k Rank
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800 text-center">
                  <div className="bg-gray-900/60 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Easy</span>
                    <span className="text-sm font-bold text-white font-mono">{leetcode.easySolved}</span>
                  </div>
                  <div className="bg-gray-900/60 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Medium</span>
                    <span className="text-sm font-bold text-white font-mono">{leetcode.mediumSolved}</span>
                  </div>
                  <div className="bg-gray-900/60 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">Hard</span>
                    <span className="text-sm font-bold text-white font-mono">{leetcode.hardSolved}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-1">
                <p className="text-xs text-gray-400">Set your username in <span className="font-mono text-amber-400">server/.env</span></p>
                <p className="text-[11px] text-gray-500 font-mono">LEETCODE_USERNAME=your_handle</p>
              </div>
            )}
          </div>

          {/* Codeforces Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm">
                  CF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Codeforces</h4>
                  <p className="text-xs text-gray-400">{codeforces?.configured ? `@${codeforces.handle}` : 'Not Connected'}</p>
                </div>
              </div>
              {codeforces?.configured && (
                <a 
                  href={`https://codeforces.com/profile/${codeforces.handle}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {codeforces?.configured ? (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-white font-mono">{codeforces.rating}</span>
                    <span className="text-xs text-gray-400 ml-1.5">Rating</span>
                  </div>
                  <span className="text-xs font-mono capitalize text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    {codeforces.rank}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-800 text-center">
                  <div className="bg-gray-900/60 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Max Rating</span>
                    <span className="text-sm font-bold text-white font-mono">{codeforces.maxRating}</span>
                  </div>
                  <div className="bg-gray-900/60 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Max Title</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono capitalize">{codeforces.maxRank}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-1">
                <p className="text-xs text-gray-400">Set your handle in <span className="font-mono text-cyan-400">server/.env</span></p>
                <p className="text-[11px] text-gray-500 font-mono">CODEFORCES_USERNAME=your_handle</p>
              </div>
            )}
          </div>

          {/* GitHub Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative group hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-white font-mono text-sm">
                  GH
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">GitHub</h4>
                  <p className="text-xs text-gray-400">{github?.configured ? `@${github.username}` : 'Not Connected'}</p>
                </div>
              </div>
              {github?.configured && (
                <a 
                  href={`https://github.com/${github.username}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {github?.configured ? (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-white font-mono">{github.publicRepos}</span>
                    <span className="text-xs text-gray-400 ml-1.5">Repositories</span>
                  </div>
                  <span className="text-xs font-mono text-gray-300 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                    {github.followers} Followers
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-400" /> Open Source Repos
                  </span>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="text-emerald-400 font-medium hover:underline"
                  >
                    View Works →
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-1">
                <p className="text-xs text-gray-400">Set your username in <span className="font-mono text-gray-300">server/.env</span></p>
                <p className="text-[11px] text-gray-500 font-mono">GITHUB_USERNAME=your_username</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Recent High-Frequency Problems Solved */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Recently Cracked Problems</h3>
            <p className="text-xs text-gray-400">High-yield algorithm problems logged in your placement vault.</p>
          </div>
          <button 
            onClick={() => setActiveTab('dsa')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Open Full Vault ({overview?.totalDsaProblems || 0}) →
          </button>
        </div>

        {(!overview?.recentProblems || overview.recentProblems.length === 0) ? (
          <div className="bg-gray-950/40 p-8 rounded-2xl border border-gray-800/80 text-center space-y-3">
            <Code2 className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs text-gray-400">No DSA problems logged yet.</p>
            <button
              onClick={() => setActiveTab('dsa')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Add your first problem in DSA Vault →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview.recentProblems.map((prob, idx) => (
              <div key={idx} className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      prob.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {prob.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{prob.topic}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {prob.approach || prob.revisitNotes || 'Mastered time & space constraints.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>{prob.timeComplexity}</span>
                  {prob.problemUrl && (
                    <a 
                      href={prob.problemUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Solve <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

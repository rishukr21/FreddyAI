import React from 'react';
import { Target, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function PlacementReadinessRing({ aiScore, latestLog }) {
  const score = aiScore?.totalScore || 0;
  
  // Circumference for r=54
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTierInfo = (s) => {
    if (s >= 85) return { label: 'Top 5% Placement Ready', color: 'text-amber-500', barColor: 'bg-amber-500' };
    if (s >= 70) return { label: 'Strong Candidate Tier', color: 'text-teal-500', barColor: 'bg-teal-500' };
    if (s >= 50) return { label: 'Competitive Progress', color: 'text-blue-400', barColor: 'bg-blue-400' };
    return { label: 'Building Core Foundations', color: 'text-foreground-secondary', barColor: 'bg-foreground-muted' };
  };

  const tier = getTierInfo(score);

  // Dynamic next best action
  const nextAction = aiScore?.tomorrowTarget?.[0] || 
    aiScore?.recommendation || 
    'Solve 1 Medium Graph / Dynamic Programming question to raise your score.';

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5 font-heading">
            <Target className="w-3.5 h-3.5" /> Placement Readiness Engine
          </span>
          <h3 className="text-lg font-heading font-bold text-foreground mt-0.5">
            Readiness Index
          </h3>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-chip border border-border bg-surface-elevated ${tier.color}`}>
          {score}/100
        </span>
      </div>

      {/* Main Radial Ring & Tier Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-auto">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-surface-elevated"
            />
            {/* Progress Stroke */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="text-amber-500 transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-heading font-extrabold text-foreground leading-none">
              {score}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted mt-1">
              Index
            </span>
          </div>
        </div>

        <div className="text-center sm:text-left space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Evaluation Bracket
          </span>
          <h4 className="text-base font-heading font-bold text-foreground">
            {tier.label}
          </h4>
          <p className="text-xs text-foreground-secondary leading-relaxed max-w-xs">
            Assessed across algorithm complexity, consistency rhythm, system design, and CS breadth.
          </p>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
        <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-border/50">
          <div className="flex justify-between text-[11px] font-medium text-foreground-muted mb-1">
            <span>DSA Depth</span>
            <span className="font-mono text-amber-500 font-bold">{aiScore?.breakdown?.problemSolving || 0}/40</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, ((aiScore?.breakdown?.problemSolving || 0) / 40) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-border/50">
          <div className="flex justify-between text-[11px] font-medium text-foreground-muted mb-1">
            <span>CS Fundamentals</span>
            <span className="font-mono text-teal-500 font-bold">{aiScore?.breakdown?.depthAndFundamentals || 0}/25</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-teal-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, ((aiScore?.breakdown?.depthAndFundamentals || 0) / 25) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-border/50">
          <div className="flex justify-between text-[11px] font-medium text-foreground-muted mb-1">
            <span>Topic Breadth</span>
            <span className="font-mono text-foreground font-bold">{aiScore?.breakdown?.breadthOfTopics || 0}/15</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-foreground-secondary h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, ((aiScore?.breakdown?.breadthOfTopics || 0) / 15) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-border/50">
          <div className="flex justify-between text-[11px] font-medium text-foreground-muted mb-1">
            <span>Consistency</span>
            <span className="font-mono text-amber-500 font-bold">{aiScore?.breakdown?.consistency || 0}/10</span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, ((aiScore?.breakdown?.consistency || 0) / 10) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic One-Line "Next Best Action" */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-start gap-2.5 text-xs text-foreground">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">Next Best Action:</span>
          <span className="text-foreground-secondary">{nextAction}</span>
        </div>
      </div>

    </div>
  );
}

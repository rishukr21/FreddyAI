import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function OnboardingChecklist({
  overview,
  user,
  stats,
  onOpenLogModal,
  setActiveTab,
  onFocusConnect
}) {
  const [collapsed, setCollapsed] = useState(false);

  const hasLogs = !!overview?.latestLog;
  const hasDsa = (overview?.totalDsaProblems || 0) > 0;
  const hasProfile = Boolean(
    user?.leetcodeUsername || user?.codeforcesUsername || user?.githubUsername ||
    stats?.leetcode?.configured || stats?.codeforces?.configured || stats?.github?.configured
  );
  const hasProject = (overview?.totalProjects || 0) > 0;
  const hasInterview = (overview?.totalInterviews || 0) > 0;

  const tasks = [
    {
      id: 'log',
      title: 'Log your first daily activity',
      description: 'Record problems solved and study hours to trigger FreddyAI scoring.',
      completed: hasLogs,
      action: onOpenLogModal,
      actionLabel: 'Log Day 1'
    },
    {
      id: 'dsa',
      title: 'Add a problem to DSA Vault',
      description: 'Save an algorithm problem with approach notes and time complexity.',
      completed: hasDsa,
      action: () => setActiveTab('dsa'),
      actionLabel: 'Go to Vault'
    },
    {
      id: 'profile',
      title: 'Connect your coding profile',
      description: 'Link your LeetCode, Codeforces, or GitHub handle for automated metric sync.',
      completed: hasProfile,
      action: onFocusConnect,
      actionLabel: 'Connect Handles'
    },
    {
      id: 'project',
      title: 'Showcase an engineering project',
      description: 'Add a system or full-stack project with tech badges and demo URLs.',
      completed: hasProject,
      action: () => setActiveTab('projects'),
      actionLabel: 'Add Project'
    },
    {
      id: 'interview',
      title: 'Record an interview or mock round',
      description: 'Document questions asked and learnings from company technical interviews.',
      completed: hasInterview,
      action: () => setActiveTab('interviews'),
      actionLabel: 'Log Interview'
    }
  ];

  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  // If all completed, hide by default unless user uncollapses
  if (completedCount === tasks.length) {
    return null;
  }

  return (
    <div className="bento-card p-6 border-amber-500/25 bg-surface/90 relative overflow-hidden transition-all">
      {/* Background soft ambient highlight */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500 flex items-center gap-1 font-heading">
              <Sparkles className="w-3.5 h-3.5" /> Setup Checklist
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-chip bg-amber-500/10 text-amber-500 border border-amber-500/30">
              {percentage}% Complete
            </span>
          </div>
          <h3 className="text-lg font-heading font-bold text-foreground mt-1">
            Placement Readiness Onboarding
          </h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Complete these 5 foundational steps to personalize FreddyAI for your placement preparation.
          </p>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          type="button"
          className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground transition-colors shrink-0"
          aria-label={collapsed ? "Expand onboarding checklist" : "Collapse onboarding checklist"}
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-elevated rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
        <div 
          className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Task List */}
      {!collapsed && (
        <div className="space-y-2.5 mt-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-subcard border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-surface-elevated/40 border-border/40 opacity-70'
                  : 'bg-surface border-border hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-foreground-muted shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-sm font-semibold ${task.completed ? 'text-foreground-secondary line-through' : 'text-foreground'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>

              {!task.completed && task.action && (
                <button
                  onClick={task.action}
                  type="button"
                  className="self-end sm:self-center px-3 py-1.5 rounded-chip text-xs font-semibold bg-surface-elevated hover:bg-amber-500 hover:text-black border border-border text-foreground transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>{task.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

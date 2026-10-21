import React from 'react';
import { 
  CalendarClock, 
  Sparkles, 
  Code2, 
  BookOpen, 
  GitCommit, 
  Flame,
  PlusCircle,
  Award,
  Trophy,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Card from './common/Card';
import Chip from './common/Chip';
import EmptyState from './common/EmptyState';

export default function Timeline({ logs = [], onOpenLogModal }) {
  // Compute milestones
  const totalProblemsSolved = logs.reduce((acc, log) => acc + (log.problems?.length || log.problemsSolvedCount || 0), 0);
  const totalDays = logs.length;

  const milestones = [
    {
      id: 'm1',
      title: 'First Step',
      condition: totalDays >= 1,
      desc: 'Recorded your very first daily session on FreddyAI.',
      icon: Flame
    },
    {
      id: 'm2',
      title: '7-Day Rhythm',
      condition: totalDays >= 7,
      desc: 'Achieved a one-week unbroken consistency streak.',
      icon: Trophy
    },
    {
      id: 'm3',
      title: '25 Problems Solved',
      condition: totalProblemsSolved >= 25,
      desc: 'Cracked 25 algorithm questions in your vault.',
      icon: Award
    },
    {
      id: 'm4',
      title: '50 Problems Century',
      condition: totalProblemsSolved >= 50,
      desc: 'Reached top percentile candidate throughput.',
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2.5">
            <CalendarClock className="w-7 h-7 text-amber-500" />
            Journey Timeline & Milestones
          </h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Transparent chronological record of daily grit, study sessions, and placement achievements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-chip bg-surface-elevated border border-border text-amber-500">
            {logs.length} Days Recorded
          </span>
          {onOpenLogModal && (
            <button
              onClick={onOpenLogModal}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span>Log Day</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= MILESTONES TRAIL BAR ================= */}
      <Card className="p-5 border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-foreground-muted font-heading flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" /> Career Placement Milestones
          </span>
          <span className="text-xs font-mono text-foreground-secondary">
            {milestones.filter(m => m.condition).length} of {milestones.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-subcard border transition-all flex items-start gap-3 ${
                  m.condition
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-subtle'
                    : 'bg-surface-elevated/40 border-border/50 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.condition ? 'bg-amber-500 text-black shadow-sm' : 'bg-surface border border-border text-foreground-muted'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-heading font-bold text-foreground flex items-center gap-1">
                    {m.title}
                    {m.condition && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 inline" />}
                  </h4>
                  <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ================= TIMELINE TRACK ================= */}
      {logs.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Your Coding Journey Starts Today"
          description="Your timeline is waiting for its first daily record. Log problems cracked, study hours invested, and architectural work to build your streak!"
          actionLabel="Log Your First Day"
          onAction={onOpenLogModal}
        />
      ) : (
        <div className="relative border-l border-border ml-4 sm:ml-6 space-y-8 pb-8">
          {logs.map((log, index) => {
            const score = log.aiScore?.totalScore || 0;
            const scoreColor = score >= 85 ? 'text-amber-500 border-amber-500/40 bg-amber-500/10' :
                               score >= 65 ? 'text-teal-500 border-teal-500/40 bg-teal-500/10' :
                               'text-rose-400 border-rose-500/40 bg-rose-500/10';

            return (
              <div key={log._id || index} className="relative pl-6 sm:pl-8 group">
                
                {/* Timeline Node Dot */}
                <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-surface border-2 border-amber-500 flex items-center justify-center group-hover:scale-125 transition-transform shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>

                {/* Card content */}
                <div className="bento-card p-6 border-border hover:border-amber-500/30 transition-all space-y-4">
                  
                  {/* Header: Date + Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-heading font-extrabold text-foreground">
                        {log.date}
                      </span>
                      <span className="text-xs text-foreground-secondary font-medium">
                        ({log.studyHours || 0} hours invested)
                      </span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-chip border text-xs font-mono font-bold ${scoreColor}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      FreddyAI Score: {score}/100
                    </div>
                  </div>

                  {/* Journal Note */}
                  {log.journalNotes && (
                    <p className="text-xs sm:text-sm text-foreground-secondary italic bg-surface-elevated/50 p-3.5 rounded-xl border border-border font-sans">
                      "{log.journalNotes}"
                    </p>
                  )}

                  {/* Problems Solved */}
                  {log.problems && log.problems.length > 0 && (
                    <div>
                      <h5 className="text-xs uppercase font-bold text-foreground-muted mb-2 flex items-center gap-1.5 font-heading">
                        <Code2 className="w-3.5 h-3.5 text-amber-500" /> Problems Tackled ({log.problems.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {log.problems.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-chip bg-surface-elevated border border-border text-xs">
                            <span className={`w-2 h-2 rounded-full ${
                              p.difficulty === 'Hard' ? 'bg-rose-500' :
                              p.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            <span className="text-foreground font-medium">{p.title}</span>
                            <span className="text-foreground-muted text-[11px] font-mono">({p.topic || 'DSA'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CS Fundamentals & Project Work */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {log.csFundamentals && log.csFundamentals.length > 0 && (
                      <div className="bg-surface-elevated/60 p-3 rounded-subcard border border-border">
                        <h5 className="text-[11px] uppercase font-bold text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1 font-heading">
                          <BookOpen className="w-3.5 h-3.5" /> Core CS Topics
                        </h5>
                        <ul className="text-xs text-foreground-secondary space-y-1">
                          {log.csFundamentals.map((topic, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-teal-500">•</span> {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {log.projectWork?.taskDescription && (
                      <div className="bg-surface-elevated/60 p-3 rounded-subcard border border-border">
                        <h5 className="text-[11px] uppercase font-bold text-amber-500 mb-1.5 flex items-center gap-1 font-heading">
                          <GitCommit className="w-3.5 h-3.5" /> Project Deliverable
                        </h5>
                        <p className="text-xs text-foreground-secondary">
                          <span className="font-semibold text-foreground">{log.projectWork.projectName || 'Project'}: </span>
                          {log.projectWork.taskDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Target Tomorrow */}
                  {log.aiScore?.tomorrowTarget && log.aiScore.tomorrowTarget.length > 0 && (
                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-foreground-muted">
                      <span>AI Target Recommendation:</span>
                      <span className="text-amber-500 font-medium font-sans">{log.aiScore.tomorrowTarget[0]}</span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

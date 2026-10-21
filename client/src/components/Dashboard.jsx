import React from 'react';
import { 
  Flame, 
  Code2, 
  Award, 
  Clock, 
  ExternalLink, 
  PlusCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import Card from './common/Card';
import StatCard from './common/StatCard';
import Chip from './common/Chip';
import EmptyState from './common/EmptyState';
import ActivityHeatmap from './dashboard/ActivityHeatmap';
import PlacementReadinessRing from './dashboard/PlacementReadinessRing';
import OnboardingChecklist from './dashboard/OnboardingChecklist';
import ConnectProfilesCard from './dashboard/ConnectProfilesCard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ 
  overview, 
  stats, 
  onOpenLogModal, 
  setActiveTab, 
  onRefresh 
}) {
  const { user } = useAuth();
  const latestLog = overview?.latestLog;
  const aiScore = latestLog?.aiScore || null;
  const history = overview?.history || [];
  const streak = overview?.streakDays || 0;

  const scrollToConnect = () => {
    const el = document.getElementById('connect-profiles-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ================= 1. BENTO HERO ROW ================= */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Streak Counter & 20-Week Activity Heatmap (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between bento-card p-6 sm:p-7 border-amber-500/25 bg-surface relative overflow-hidden">
          {/* Subtle ambient glow in background */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Streak & Momentum */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-500 flex items-center gap-1.5 font-heading">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> Continuous Preparation
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-foreground tracking-tight">
                  {streak} <span className="text-xl sm:text-2xl font-normal font-sans text-foreground-muted">Day Streak</span>
                </h2>
              </div>
              <p className="text-xs text-foreground-secondary mt-1">
                {streak > 0 
                  ? 'Consistent daily grit compounds into effortless interview confidence.' 
                  : 'Start your streak today by logging your first coding or study session.'}
              </p>
            </div>

            {/* Quick Log Action */}
            <button
              onClick={onOpenLogModal}
              type="button"
              className="self-start sm:self-center px-4 py-2.5 rounded-chip text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span>Log Today</span>
            </button>
          </div>

          {/* Bottom: 20-Week Heatmap */}
          <div className="mt-5 pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted font-heading">
                Activity Distribution
              </span>
              <span className="text-[11px] font-mono text-foreground-muted">
                Last 20 Weeks
              </span>
            </div>
            <ActivityHeatmap history={history} />
          </div>
        </div>

        {/* Right: Big Placement Readiness Ring / Gauge (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bento-card p-6 sm:p-7 border-border bg-surface flex flex-col justify-between">
          <PlacementReadinessRing 
            aiScore={aiScore} 
            latestLog={latestLog} 
          />
        </div>

      </div>

      {/* ================= 2. ONBOARDING CHECKLIST ROW ================= */}
      <OnboardingChecklist 
        overview={overview} 
        user={user} 
        stats={stats} 
        onOpenLogModal={onOpenLogModal}
        setActiveTab={setActiveTab}
        onFocusConnect={scrollToConnect}
      />

      {/* ================= 3. STAT CARDS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Vaulted Questions"
          value={overview?.totalDsaProblems || 0}
          unit="problems"
          icon={Code2}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10 border-amber-500/20"
          description="High-frequency company interview problems"
          onClick={() => setActiveTab('dsa')}
        />

        <StatCard
          label="Interview Rounds"
          value={overview?.totalInterviews || 0}
          unit="rounds"
          icon={Award}
          iconColor="text-teal-500"
          iconBg="bg-teal-500/10 border-teal-500/20"
          description="Technical OAs & mock experiences"
          onClick={() => setActiveTab('interviews')}
        />

        <StatCard
          label="Today's Focus"
          value={latestLog?.studyHours || 0}
          unit="hrs"
          icon={Clock}
          iconColor="text-foreground"
          iconBg="bg-surface-elevated border-border"
          description={latestLog?.date ? `Logged for ${latestLog.date}` : 'No sessions logged today'}
          onClick={onOpenLogModal}
        />
      </div>

      {/* ================= 4. IN-APP PROFILE CONNECTOR ================= */}
      <ConnectProfilesCard 
        stats={stats} 
        onRefresh={onRefresh} 
      />

      {/* ================= 5. RECENTLY CRACKED PROBLEMS ================= */}
      <Card className="border-border">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground">
              Recently Cracked Problems
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              High-yield algorithm problems recorded in your personalized preparation vault.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dsa')}
            type="button"
            className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <span>Open Vault ({overview?.totalDsaProblems || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {(!overview?.recentProblems || overview.recentProblems.length === 0) ? (
          <EmptyState
            icon={Code2}
            title="No Problems Vaulted Yet"
            description="Start building your competitive edge by recording algorithm approaches and optimal time complexities."
            actionLabel="Add Your First Problem"
            onAction={() => setActiveTab('dsa')}
            className="border-dashed"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview.recentProblems.map((prob) => {
              const diffVariant = (prob.difficulty || '').toLowerCase() === 'hard' ? 'hard' :
                                  (prob.difficulty || '').toLowerCase() === 'medium' ? 'medium' : 'easy';
              return (
                <div 
                  key={prob._id} 
                  className="bento-card-subtle p-4 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Chip 
                        label={prob.difficulty} 
                        variant={diffVariant} 
                        size="sm" 
                      />
                      <Chip 
                        label={prob.topic} 
                        variant="default" 
                        size="sm" 
                      />
                    </div>
                    
                    <h4 className="text-sm font-semibold font-heading text-foreground line-clamp-1">
                      {prob.title}
                    </h4>
                    
                    <p className="text-xs text-foreground-muted mt-2 line-clamp-2 leading-relaxed">
                      {prob.approach || prob.revisitNotes || 'Mastered solution constraints and edge cases.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono">
                    <span className="text-foreground-secondary">{prob.timeComplexity || 'O(N)'}</span>
                    {prob.problemUrl && (
                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-500 hover:underline flex items-center gap-1 font-sans font-medium"
                      >
                        <span>Solve</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

    </div>
  );
}

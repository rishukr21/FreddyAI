import React from 'react';
import { 
  CalendarClock, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  BookOpen, 
  GitCommit, 
  Flame,
  PlusCircle
} from 'lucide-react';

export default function Timeline({ logs = [], onOpenLogModal }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 text-cyan-400" />
            Coding Journey & Daily Devlogs
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Transparent chronological record of daily grit, study sessions, and continuous placement preparation.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400 font-semibold">
          {logs.length} Days Recorded
        </span>
      </div>

      {/* Empty State or Timeline */}
      {logs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-gray-800 space-y-4">
          <CalendarClock className="w-12 h-12 text-gray-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-gray-200">No Devlogs Recorded Yet</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Your timeline is waiting for its first entry. Record today's coding hours, problems solved, and CS topics to start your streak!
            </p>
          </div>
          {onOpenLogModal && (
            <button
              onClick={onOpenLogModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Log Your First Day
            </button>
          )}
        </div>
      ) : (
        <div className="relative border-l border-gray-800 ml-4 sm:ml-6 space-y-8 pb-8">
          {logs.map((log, index) => {
            const score = log.aiScore?.totalScore || 0;
            const scoreColor = score >= 85 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
                               score >= 65 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' :
                               'text-rose-400 border-rose-500/40 bg-rose-500/10';

            return (
              <div key={log._id || index} className="relative pl-6 sm:pl-8 group">
                
                {/* Timeline Node Dot */}
                <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-[#0b0f19] border-2 border-emerald-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>

                {/* Card content */}
                <div className="glass-panel rounded-3xl p-6 border border-gray-800 hover:border-emerald-500/30 transition-all bg-gradient-to-br from-gray-900/60 to-gray-950/80 shadow-lg space-y-4">
                  
                  {/* Header: Date + Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800/80">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-white font-mono">
                        {log.date}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        ({log.studyHours || 0} hours invested)
                      </span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${scoreColor}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      FreddyAI Score: {score}/100
                    </div>
                  </div>

                  {/* Journal Note */}
                  {log.journalNotes && (
                    <p className="text-xs sm:text-sm text-gray-300 italic bg-gray-950/40 p-3.5 rounded-2xl border border-gray-800/60">
                      "{log.journalNotes}"
                    </p>
                  )}

                  {/* Problems Solved */}
                  {log.problems && log.problems.length > 0 && (
                    <div>
                      <h5 className="text-xs uppercase font-bold text-gray-400 mb-2 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-400" /> Problems Tackled ({log.problems.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {log.problems.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs">
                            <span className={`w-2 h-2 rounded-full ${
                              p.difficulty === 'Hard' ? 'bg-rose-400' :
                              p.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}></span>
                            <span className="text-white font-medium">{p.title}</span>
                            <span className="text-gray-500 text-[11px] font-mono">({p.topic || 'DSA'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CS Fundamentals & Project Work */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {log.csFundamentals && log.csFundamentals.length > 0 && (
                      <div className="bg-gray-950/40 p-3 rounded-2xl border border-gray-800/60">
                        <h5 className="text-[11px] uppercase font-bold text-cyan-400 mb-1.5 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> Core CS Topics
                        </h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {log.csFundamentals.map((topic, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-cyan-400">•</span> {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {log.projectWork?.taskDescription && (
                      <div className="bg-gray-950/40 p-3 rounded-2xl border border-gray-800/60">
                        <h5 className="text-[11px] uppercase font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                          <GitCommit className="w-3.5 h-3.5" /> Project Progress
                        </h5>
                        <p className="text-xs text-gray-300">
                          <span className="font-semibold text-white">{log.projectWork.projectName || 'Project'}: </span>
                          {log.projectWork.taskDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Tomorrow Target */}
                  {log.aiScore?.tomorrowTarget && log.aiScore.tomorrowTarget.length > 0 && (
                    <div className="pt-2 border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="text-gray-400">AI Next-Day Priority:</span>
                      <span className="text-emerald-400 font-medium">{log.aiScore.tomorrowTarget[0]}</span>
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

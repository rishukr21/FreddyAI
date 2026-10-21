import React, { useMemo } from 'react';

export default function ActivityHeatmap({ history = [] }) {
  // Generate data for the past 20 weeks (140 days)
  const { weeks, monthLabels, totalContributions } = useMemo(() => {
    // Map dates to problem counts
    const dateMap = new Map();
    let total = 0;

    history.forEach((log) => {
      if (log.date) {
        const count = (log.problemsSolvedCount || log.problems?.length || 0);
        dateMap.set(log.date, count);
        total += count;
      }
    });

    const now = new Date();
    // End on current day, back 140 days
    const days = [];
    for (let i = 139; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dateMap.get(dateStr) || 0;
      days.push({
        date: dateStr,
        dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon...
        month: d.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    // Group into columns of 7 days (weeks)
    const groupedWeeks = [];
    let currentWeek = [];
    const months = [];
    let lastMonth = '';

    days.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === days.length - 1) {
        groupedWeeks.push(currentWeek);
        // Track month label at the start of new month
        const firstDayMonth = currentWeek[0].month;
        if (firstDayMonth !== lastMonth) {
          months.push({ colIndex: groupedWeeks.length - 1, label: firstDayMonth });
          lastMonth = firstDayMonth;
        }
        currentWeek = [];
      }
    });

    return { weeks: groupedWeeks, monthLabels: months, totalContributions: total };
  }, [history]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-surface-elevated hover:border-border';
    if (count <= 2) return 'bg-amber-500/30 border-amber-500/40';
    if (count <= 4) return 'bg-amber-500/65 border-amber-500/70 text-black';
    return 'bg-amber-500 border-amber-400 text-black shadow-sm';
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[580px]">
        {/* Month labels header */}
        <div className="flex text-[11px] text-foreground-muted font-mono mb-2 pl-7 relative h-4">
          {monthLabels.map((m, idx) => (
            <span
              key={idx}
              className="absolute truncate"
              style={{ left: `${m.colIndex * 26 + 28}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-2">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[10px] text-foreground-muted font-mono pr-1 pt-1 h-[98px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Weeks Columns */}
          <div className="flex gap-1.5 flex-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} problem${day.count === 1 ? '' : 's'} solved`}
                    className={`w-3.5 h-3.5 rounded-sm border border-transparent transition-transform hover:scale-125 cursor-pointer ${getColorClass(day.count)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-foreground-muted mt-3 pt-2 border-t border-border/50">
          <span className="font-mono text-[11px]">
            <span className="text-amber-500 font-bold">{totalContributions}</span> problems logged in past 20 weeks
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-surface-elevated"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/65"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

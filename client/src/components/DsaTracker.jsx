import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Search, 
  ExternalLink, 
  Clock, 
  Tag, 
  CheckCircle, 
  Bookmark, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  X,
  RotateCcw,
  Building2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';
import Chip from './common/Chip';
import EmptyState from './common/EmptyState';

export default function DsaTracker({ problems = [], onProblemAdded, onOpenAuthModal }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('all'); // 'all' | 'revise'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  
  // Add problem modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('LeetCode');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newTopic, setNewTopic] = useState('Dynamic Programming');
  const [newTimeComp, setNewTimeComp] = useState('O(N)');
  const [newSpaceComp, setNewSpaceComp] = useState('O(1)');
  const [newApproach, setNewApproach] = useState('');
  const [newCompanyTags, setNewCompanyTags] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = [
    'All',
    'Arrays',
    'Strings',
    'Two Pointers',
    'Sliding Window',
    'Binary Search',
    'Dynamic Programming',
    'Graphs',
    'Binary Trees',
    'Heap / Priority Queue',
    'Design'
  ];

  // Calculate spaced repetition status for each problem
  const problemsWithIntervals = useMemo(() => {
    const now = new Date();
    return problems.map((prob) => {
      const solvedDate = prob.solvedAt ? new Date(prob.solvedAt) : new Date();
      const diffTime = Math.abs(now - solvedDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Spaced repetition interval check (1, 3, 7, 21 days or explicitly marked Revisit)
      let isDue = false;
      let intervalLabel = '';

      if (prob.status === 'Revisit') {
        isDue = true;
        intervalLabel = 'Manual Revisit';
      } else if (diffDays === 1) {
        isDue = true;
        intervalLabel = 'Day 1 Check';
      } else if (diffDays === 3) {
        isDue = true;
        intervalLabel = 'Day 3 Interval';
      } else if (diffDays === 7) {
        isDue = true;
        intervalLabel = 'Day 7 Interval';
      } else if (diffDays >= 21 && diffDays % 7 === 0) {
        isDue = true;
        intervalLabel = 'Day 21+ Mastery';
      }

      return {
        ...prob,
        diffDays,
        isDue,
        intervalLabel
      };
    });
  }, [problems]);

  // Extract all distinct company tags
  const allCompanies = useMemo(() => {
    const set = new Set();
    problems.forEach(p => {
      (p.tags || []).forEach(t => {
        const lower = t.toLowerCase();
        if (['google', 'amazon', 'microsoft', 'meta', 'apple', 'uber', 'atlassian', 'netflix'].includes(lower)) {
          set.add(t);
        }
      });
    });
    return ['All', ...Array.from(set)];
  }, [problems]);

  const reviseDueList = useMemo(() => {
    return problemsWithIntervals.filter(p => p.isDue);
  }, [problemsWithIntervals]);

  // Filter problems according to search, topic, difficulty, company, and view tab
  const filteredProblems = useMemo(() => {
    const sourceList = activeView === 'revise' ? reviseDueList : problemsWithIntervals;

    return sourceList.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesTopic = selectedTopic === 'All' || item.topic === selectedTopic;
      const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      const matchesCompany = selectedCompany === 'All' || 
        (item.tags && item.tags.some(t => t.toLowerCase() === selectedCompany.toLowerCase()));

      return matchesSearch && matchesTopic && matchesDifficulty && matchesCompany;
    });
  }, [activeView, problemsWithIntervals, reviseDueList, searchTerm, selectedTopic, selectedDifficulty, selectedCompany]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenAddModal = () => {
    if (!isAuthenticated && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);

    const extraTags = newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const companyTags = newCompanyTags ? newCompanyTags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const combinedTags = [...new Set([newTopic, ...extraTags, ...companyTags])];

    const payload = {
      title: newTitle.trim(),
      problemUrl: newUrl.trim(),
      platform: newPlatform,
      difficulty: newDifficulty,
      topic: newTopic,
      timeComplexity: newTimeComp.trim() || 'O(N)',
      spaceComplexity: newSpaceComp.trim() || 'O(1)',
      approach: newApproach.trim(),
      tags: combinedTags,
      status: 'Solved'
    };

    try {
      const res = await authFetch('/api/dsa', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (onProblemAdded) onProblemAdded();
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewUrl('');
        setNewApproach('');
        setNewTags('');
        setNewCompanyTags('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to save problem. Please sign in.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-amber-500" />
            DSA Question Vault
          </h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Algorithm repository with spaced repetition intervals, optimal complexity analysis, and company tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Add Problem</span>
          </button>
        </div>
      </div>

      {/* Main View Tabs (All vs Revise Today Queue) */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveView('all')}
          type="button"
          className={`pb-3 px-3 text-sm font-heading font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'all'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <span>All Vault Questions</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-chip bg-surface-elevated text-foreground-secondary border border-border">
            {problems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('revise')}
          type="button"
          className={`pb-3 px-3 text-sm font-heading font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeView === 'revise'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <span>Revise Today Queue</span>
          {reviseDueList.length > 0 && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-chip bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {reviseDueList.length} Due
            </span>
          )}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 sm:p-5 border-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search by problem title, keyword, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Company Filter Dropdown (if tags exist) */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Companies</option>
              <option value="Google">Google</option>
              <option value="Amazon">Amazon</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Atlassian">Atlassian</option>
              <option value="Uber">Uber</option>
              <option value="Meta">Meta</option>
            </select>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              type="button"
              className={`px-3 py-1 rounded-chip text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-surface-elevated text-foreground-muted hover:text-foreground border border-border'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* Problem Cards List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <EmptyState
            icon={activeView === 'revise' ? RotateCcw : Code2}
            title={activeView === 'revise' ? "Zero Revisions Due Today" : "No Matching DSA Problems"}
            description={activeView === 'revise'
              ? "You're completely caught up on your spaced repetition schedule (1, 3, 7, 21-day cycles). Keep crushing new problems!"
              : "No problems match your current topic or difficulty filter. Try clearing filters or record a new question."
            }
            actionLabel="Add New Problem"
            onAction={handleOpenAddModal}
          />
        ) : (
          filteredProblems.map((prob) => {
            const isExpanded = expandedId === prob._id;
            const diffVariant = (prob.difficulty || '').toLowerCase() === 'hard' ? 'hard' :
                                (prob.difficulty || '').toLowerCase() === 'medium' ? 'medium' : 'easy';

            return (
              <div 
                key={prob._id} 
                className="bento-card hover:border-amber-500/40 transition-all overflow-hidden"
              >
                <div 
                  onClick={() => toggleExpand(prob._id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="mt-0.5 sm:mt-0">
                      <Chip 
                        label={prob.difficulty} 
                        variant={diffVariant} 
                        size="sm" 
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-heading font-bold text-foreground hover:text-amber-500 transition-colors">
                          {prob.title}
                        </h3>

                        {prob.intervalLabel && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-chip bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {prob.intervalLabel}
                          </span>
                        )}

                        {prob.status === 'Mastered' && (
                          <Chip 
                            label="Mastered" 
                            variant="teal" 
                            size="sm" 
                            icon={CheckCircle} 
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-foreground-muted mt-1 font-sans">
                        <span className="text-foreground-secondary font-medium">{prob.topic}</span>
                        <span>•</span>
                        <span className="font-mono">{prob.platform || 'LeetCode'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="bg-surface-elevated px-2 py-1 rounded-md border border-border text-teal-600 dark:text-teal-400">
                        {prob.timeComplexity}
                      </span>
                      <span className="bg-surface-elevated px-2 py-1 rounded-md border border-border text-foreground-secondary">
                        {prob.spaceComplexity}
                      </span>
                    </div>

                    {prob.problemUrl && (
                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-surface-elevated border border-border text-foreground-muted hover:text-amber-500 hover:border-amber-500/40 transition-colors"
                        title="Open on Problem Platform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button 
                      type="button"
                      aria-label={isExpanded ? "Collapse solution approach" : "Expand solution approach"}
                      className="text-foreground-muted hover:text-foreground p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Approach & Notes */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-border bg-surface-subtle space-y-3">
                    {prob.approach && (
                      <div>
                        <h5 className="text-xs uppercase font-bold text-foreground-muted mb-1.5 flex items-center gap-1.5 font-heading">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Optimal Solution Approach
                        </h5>
                        <p className="text-xs text-foreground-secondary leading-relaxed bg-surface p-3.5 rounded-xl border border-border font-sans">
                          {prob.approach}
                        </p>
                      </div>
                    )}

                    {prob.revisitNotes && (
                      <div>
                        <h5 className="text-xs uppercase font-bold text-amber-500 mb-1 flex items-center gap-1.5 font-heading">
                          <Bookmark className="w-3.5 h-3.5" /> Revisit / Interview Notes
                        </h5>
                        <p className="text-xs text-amber-700 dark:text-amber-200/90 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                          {prob.revisitNotes}
                        </p>
                      </div>
                    )}

                    {prob.tags && prob.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3 h-3 text-foreground-muted" />
                        {prob.tags.map((tag, i) => (
                          <Chip 
                            key={i} 
                            label={`#${tag}`} 
                            variant="default" 
                            size="sm" 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Problem Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bento-card w-full max-w-xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-surface border-border">
            <button
              onClick={() => setIsAddModalOpen(false)}
              type="button"
              className="absolute top-5 right-5 text-foreground-muted hover:text-foreground p-2 rounded-xl bg-surface-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">Add Problem to Vault</h3>
                <p className="text-xs text-foreground-muted">Save your approach and start spaced repetition intervals.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Trapping Rain Water, Course Schedule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Dynamic Programming"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    placeholder="O(N)"
                    value={newTimeComp}
                    onChange={(e) => setNewTimeComp(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    placeholder="O(1)"
                    value={newSpaceComp}
                    onChange={(e) => setNewSpaceComp(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Company Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Google, Amazon, Uber"
                    value={newCompanyTags}
                    onChange={(e) => setNewCompanyTags(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Problem URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Optimal Approach / Logic</label>
                <textarea
                  rows="3"
                  placeholder="Explain intuition, edge cases, and state transitions..."
                  value={newApproach}
                  onChange={(e) => setNewApproach(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none resize-none font-sans"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Code2, 
  Search, 
  ExternalLink, 
  Clock, 
  Database, 
  Tag, 
  CheckCircle, 
  Bookmark, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  X
} from 'lucide-react';

export default function DsaTracker({ problems = [], onProblemAdded }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
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

  const filteredProblems = problems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTopic = selectedTopic === 'All' || item.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);

    const payload = {
      title: newTitle.trim(),
      problemUrl: newUrl.trim(),
      platform: newPlatform,
      difficulty: newDifficulty,
      topic: newTopic,
      timeComplexity: newTimeComp.trim() || 'O(N)',
      spaceComplexity: newSpaceComp.trim() || 'O(1)',
      approach: newApproach.trim(),
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [newTopic],
      status: 'Solved'
    };

    try {
      const res = await fetch('/api/dsa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (onProblemAdded) onProblemAdded();
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewUrl('');
        setNewApproach('');
        setNewTags('');
      } else {
        alert('Failed to save problem');
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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-emerald-400" />
            DSA Question Vault & Archive
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Curated list of critical product-company interview problems, time complexities, and optimal approaches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-emerald-400 font-semibold">
            {filteredProblems.length} of {problems.length} Problems
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Problem
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by problem name, keyword, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Mastered">Mastered</option>
              <option value="Revisit">Needs Revisit</option>
            </select>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-gray-800 space-y-4">
            <Code2 className="w-12 h-12 text-gray-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-gray-200">No DSA Questions Found</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {problems.length === 0 
                  ? "Your question vault is currently empty. Click 'Add Problem' to start recording your solved questions!"
                  : "No problems match your current filters. Try resetting the topic or difficulty selection."}
              </p>
            </div>
            {problems.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                Add Your First Problem
              </button>
            )}
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isExpanded = expandedId === prob._id;
            return (
              <div 
                key={prob._id} 
                className="glass-panel rounded-2xl border border-gray-800/90 hover:border-gray-700 transition-all overflow-hidden"
              >
                <div 
                  onClick={() => toggleExpand(prob._id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="mt-1 sm:mt-0">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                        prob.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                          {prob.title}
                        </h3>
                        {prob.status === 'Mastered' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Mastered
                          </span>
                        )}
                        {prob.status === 'Revisit' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                            <Bookmark className="w-3 h-3" /> Review Due
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="text-gray-300 font-medium">{prob.topic}</span>
                        <span>•</span>
                        <span className="font-mono text-gray-400">{prob.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="bg-gray-900 px-2 py-1 rounded-md border border-gray-800 text-cyan-400">
                        {prob.timeComplexity}
                      </span>
                      <span className="bg-gray-900 px-2 py-1 rounded-md border border-gray-800 text-purple-400">
                        {prob.spaceComplexity}
                      </span>
                    </div>

                    {prob.problemUrl && (
                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                        title="Open on Problem Platform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button className="text-gray-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Approach & Notes */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-800/60 bg-gray-950/40 space-y-3">
                    {prob.approach && (
                      <div>
                        <h5 className="text-xs uppercase font-bold text-gray-400 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Optimal Approach
                        </h5>
                        <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/60 p-3 rounded-xl border border-gray-800/80 font-sans">
                          {prob.approach}
                        </p>
                      </div>
                    )}

                    {prob.revisitNotes && (
                      <div>
                        <h5 className="text-xs uppercase font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5" /> Revisit / Interview Tip
                        </h5>
                        <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                          {prob.revisitNotes}
                        </p>
                      </div>
                    )}

                    {prob.tags && prob.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3 h-3 text-gray-500" />
                        {prob.tags.map((tag, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-900 text-gray-400 border border-gray-800 font-mono">
                            #{tag}
                          </span>
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
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-gray-700 p-6 sm:p-7 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-[#0f1422]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add DSA Problem to Vault</h3>
                <p className="text-xs text-gray-400">Record a solved algorithm problem with notes and time complexity.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Trapping Rain Water, Course Schedule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
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
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Dynamic Programming"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    placeholder="O(N)"
                    value={newTimeComp}
                    onChange={(e) => setNewTimeComp(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    placeholder="O(1)"
                    value={newSpaceComp}
                    onChange={(e) => setNewSpaceComp(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Problem URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Optimal Approach / Logic</label>
                <textarea
                  rows="3"
                  placeholder="Explain the intuition, state transitions, or two-pointer logic..."
                  value={newApproach}
                  onChange={(e) => setNewApproach(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. DP, Memoization, GoogleOA"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
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

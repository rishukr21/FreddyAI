import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Code2, BookOpen, Clock, GitCommit } from 'lucide-react';

export default function LogModal({ isOpen, onClose, onLogSuccess }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [studyHours, setStudyHours] = useState(4);
  const [problems, setProblems] = useState([
    { title: '', difficulty: 'Medium', topic: 'Dynamic Programming', platform: 'LeetCode' }
  ]);
  const [csTopics, setCsTopics] = useState('');
  const [projectName, setProjectName] = useState('FreddyAI');
  const [projectTask, setProjectTask] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddProblem = () => {
    setProblems([...problems, { title: '', difficulty: 'Medium', topic: 'Graphs', platform: 'LeetCode' }]);
  };

  const handleRemoveProblem = (index) => {
    setProblems(problems.filter((_, i) => i !== index));
  };

  const handleProblemChange = (index, field, value) => {
    const updated = [...problems];
    updated[index][field] = value;
    setProblems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validProblems = problems.filter(p => p.title.trim().length > 0);
    const parsedCs = csTopics ? csTopics.split(',').map(s => s.trim()).filter(Boolean) : [];

    const payload = {
      date,
      studyHours: Number(studyHours),
      problems: validProblems,
      csFundamentals: parsedCs,
      projectWork: {
        projectName,
        taskDescription: projectTask,
        commitsCount: projectTask ? 2 : 0
      },
      journalNotes: notes
    };

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onLogSuccess(data.data);
        onClose();
      } else {
        alert('Failed to save log. Please ensure the backend is running.');
      }
    } catch (err) {
      alert('Error submitting log: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-gray-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-[#0f1422]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Record Daily Coding Activity</h3>
            <p className="text-xs text-gray-400">FreddyAI will analyze your inputs and calculate your daily placement readiness score.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Date & Study Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Focused Hours (DSA + Dev)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Problems Solved Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" /> DSA Problems Tackled Today
              </label>
              <button
                type="button"
                onClick={handleAddProblem}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Problem
              </button>
            </div>

            {problems.map((prob, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-gray-900/60 p-3 rounded-2xl border border-gray-800">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Problem title (e.g. Trapping Rain Water)"
                    value={prob.title}
                    onChange={(e) => handleProblemChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={prob.topic}
                    onChange={(e) => handleProblemChange(idx, 'topic', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Binary Trees">Binary Trees</option>
                    <option value="Two Pointers">Two Pointers</option>
                    <option value="Heap / Priority Queue">Heap</option>
                    <option value="Design">Design</option>
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={prob.difficulty}
                    onChange={(e) => handleProblemChange(idx, 'difficulty', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="sm:col-span-1 flex items-center justify-center">
                  {problems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProblem(idx)}
                      className="text-gray-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CS Fundamentals */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Core CS Topics Revised (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. OS: Virtual Memory, DBMS: Normalization, System Design: Caching"
              value={csTopics}
              onChange={(e) => setCsTopics(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Project Work */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-purple-400" /> Project Work Accomplished
            </label>
            <input
              type="text"
              placeholder="e.g. Implemented WebSockets CRDT sync and dockerized the runner"
              value={projectTask}
              onChange={(e) => setProjectTask(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Personal Journal Note & Reflections
            </label>
            <textarea
              rows="2"
              placeholder="What went well today? What edge cases or blockers did you crack?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              {isSubmitting ? 'Evaluating with AI...' : 'Submit & Compute AI Score'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

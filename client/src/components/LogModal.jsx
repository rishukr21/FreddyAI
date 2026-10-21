import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Code2, BookOpen, Clock, GitCommit, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function LogModal({ isOpen, onClose, onLogSuccess }) {
  const { authFetch } = useAuth();
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
  const [evaluationResult, setEvaluationResult] = useState(null);

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
    setEvaluationResult(null);

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
      const res = await authFetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const score = data.data?.aiScore?.totalScore || 75;

        // Trigger confetti for high score!
        if (score >= 80) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        setEvaluationResult(data.data?.aiScore);
        setTimeout(() => {
          onLogSuccess(data.data);
          onClose();
          setEvaluationResult(null);
        }, 1600);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to save log. Please ensure you are logged in.');
      }
    } catch (err) {
      alert('Error submitting log: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bento-card w-full max-w-2xl border-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-surface">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-5 right-5 text-foreground-muted hover:text-foreground p-2 rounded-xl bg-surface-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground">Record Daily Coding Activity</h3>
            <p className="text-xs text-foreground-secondary">FreddyAI evaluates difficulty, consistency, and CS depth in real-time.</p>
          </div>
        </div>

        {/* Instant Evaluation Success Banner */}
        {evaluationResult && (
          <div className="mb-6 p-4 rounded-subcard bg-amber-500/15 border border-amber-500/30 animate-fadeIn text-foreground">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-heading font-bold">
                Logged Successfully! Daily Placement Score: {evaluationResult.totalScore}/100
              </h4>
            </div>
            <p className="text-xs text-foreground-secondary">
              {evaluationResult.recommendation}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Date & Study Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">Session Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">Focused Hours (DSA + Dev)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          {/* Problems Solved Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground-secondary flex items-center gap-1.5 font-heading">
                <Code2 className="w-4 h-4 text-amber-500" /> DSA Problems Solved Today
              </label>
              <button
                type="button"
                onClick={handleAddProblem}
                className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {problems.map((prob, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-surface-elevated/60 p-3 rounded-subcard border border-border">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Problem title (e.g. Trapping Rain Water)"
                    value={prob.title}
                    onChange={(e) => handleProblemChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={prob.topic}
                    onChange={(e) => handleProblemChange(idx, 'topic', e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none"
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
                    className="w-full px-2 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none"
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
                      className="text-foreground-muted hover:text-rose-500 p-1"
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
            <label className="text-xs font-semibold text-foreground-secondary block mb-1 flex items-center gap-1.5 font-heading">
              <BookOpen className="w-3.5 h-3.5 text-teal-500" /> Core CS Topics Revised (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. OS: Virtual Memory, DBMS: Indexing, CN: TCP Handshake"
              value={csTopics}
              onChange={(e) => setCsTopics(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Project Work */}
          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1 flex items-center gap-1.5 font-heading">
              <GitCommit className="w-3.5 h-3.5 text-amber-500" /> Project Work Accomplished
            </label>
            <input
              type="text"
              placeholder="e.g. Built JWT token auth and optimized MongoDB queries"
              value={projectTask}
              onChange={(e) => setProjectTask(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1">
              Personal Dev Reflection & Edge Cases Learned
            </label>
            <textarea
              rows="2"
              placeholder="What intuition or edge cases did you master today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-amber-500 resize-none font-sans"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-chip text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              {isSubmitting ? 'Evaluating Performance...' : 'Submit & Compute Score'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

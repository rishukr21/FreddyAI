import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Star, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';
import Chip from './common/Chip';
import EmptyState from './common/EmptyState';

export default function InterviewArchive({ interviews = [], onInterviewAdded, onOpenAuthModal }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('All');
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [roundType, setRoundType] = useState('Technical Round 1');
  const [rating, setRating] = useState(8);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionTopic, setQuestionTopic] = useState('Algorithms');
  const [questionDifficulty, setQuestionDifficulty] = useState('Medium');
  const [approachNotes, setApproachNotes] = useState('');
  const [learnings, setLearnings] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companies = ['All', ...new Set(interviews.map(i => i.company))];

  const filtered = selectedCompany === 'All' 
    ? interviews 
    : interviews.filter(i => i.company === selectedCompany);

  const handleOpenAddModal = () => {
    if (!isAuthenticated && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    if (!company.trim()) return;
    setIsSubmitting(true);

    const questionsAsked = questionText.trim() ? [{
      questionText: questionText.trim(),
      topic: questionTopic,
      difficulty: questionDifficulty,
      wasAbleToSolve: true,
      notes: approachNotes.trim()
    }] : [];

    const keyLearnings = learnings ? learnings.split('\n').map(l => l.trim()).filter(Boolean) : [];

    const payload = {
      company: company.trim(),
      role: role.trim(),
      roundType,
      rating: Number(rating),
      date: new Date(),
      status: 'Completed',
      experienceSummary: experienceSummary.trim(),
      questionsAsked,
      keyLearnings
    };

    try {
      const res = await authFetch('/api/interviews', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (onInterviewAdded) onInterviewAdded();
        setIsAddModalOpen(false);
        setCompany('');
        setExperienceSummary('');
        setQuestionText('');
        setApproachNotes('');
        setLearnings('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to save interview record. Please sign in.');
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
            <Briefcase className="w-7 h-7 text-teal-500" />
            Interview Vault & Experiences
          </h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Company placement rounds, technical problem deep dives, and key interviewer takeaways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Log Interview</span>
          </button>
        </div>
      </div>

      {/* Company filter chips if we have interviews */}
      {interviews.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              type="button"
              className={`px-3 py-1.5 rounded-chip text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCompany === c
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-surface-elevated text-foreground-muted hover:text-foreground border border-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Empty State or Interview Cards */}
      {interviews.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Interview Experiences Logged Yet"
          description="Record questions asked during technical interviews, online assessments, and mock rounds to build your personal company preparation vault."
          actionLabel="Log Your First Interview"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((item) => (
            <div 
              key={item._id}
              className="bento-card p-6 sm:p-7 border-border hover:border-teal-500/35 transition-all bg-surface"
            >
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500 font-bold text-lg font-heading">
                    {item.company.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-heading font-bold text-foreground">{item.company}</h3>
                      <Chip 
                        label={item.roundType} 
                        variant="teal" 
                        size="sm" 
                      />
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-foreground-muted" />
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-chip border border-amber-500/30 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {item.rating}/10
                  </span>
                </div>
              </div>

              {/* Experience Summary */}
              {item.experienceSummary && (
                <div className="mt-4">
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {item.experienceSummary}
                  </p>
                </div>
              )}

              {/* Questions Asked */}
              {item.questionsAsked && item.questionsAsked.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  <h4 className="text-xs uppercase font-bold text-foreground-muted tracking-wider flex items-center gap-1.5 font-heading">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-500" /> Questions Posed by Interviewer
                  </h4>
                  <div className="space-y-2">
                    {item.questionsAsked.map((q, idx) => {
                      const diffVariant = (q.difficulty || '').toLowerCase() === 'hard' ? 'hard' :
                                          (q.difficulty || '').toLowerCase() === 'medium' ? 'medium' : 'easy';
                      return (
                        <div key={idx} className="bg-surface-elevated/60 p-4 rounded-subcard border border-border space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold font-heading text-foreground">
                              "{q.questionText}"
                            </p>
                            <Chip 
                              label={q.difficulty || 'Medium'} 
                              variant={diffVariant} 
                              size="sm" 
                            />
                          </div>
                          {q.notes && (
                            <p className="text-xs text-foreground-secondary bg-surface p-2.5 rounded-lg border border-border font-mono">
                              Approach: {q.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Learnings */}
              {item.keyLearnings && item.keyLearnings.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <h4 className="text-xs uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1.5 mb-2 font-heading">
                    <Lightbulb className="w-3.5 h-3.5" /> Interview Takeaways & Advice
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {item.keyLearnings.map((learning, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-surface-elevated/40 p-3 rounded-lg border border-border text-xs text-foreground-secondary">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{learning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Add Interview Modal */}
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
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">Log Interview Experience</h3>
                <p className="text-xs text-foreground-muted">Document rounds, technical questions, and interview insights.</p>
              </div>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Amazon, Uber"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="SDE-1 / Software Intern"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Round Type</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none"
                  >
                    <option value="Online Assessment">Online Assessment (OA)</option>
                    <option value="Technical Round 1">Technical Round 1</option>
                    <option value="Technical Round 2">Technical Round 2</option>
                    <option value="System Design">System Design</option>
                    <option value="HR / Managerial">HR / Managerial</option>
                    <option value="Mock Interview">Mock Interview</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Self-Rating (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Experience Summary</label>
                <textarea
                  rows="2"
                  placeholder="How did the interviewer conduct the round? What was their focus?"
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none resize-none font-sans"
                ></textarea>
              </div>

              <div className="bg-surface-elevated/60 p-3.5 rounded-subcard border border-border space-y-3">
                <span className="text-xs font-bold text-foreground font-heading block">Question Posed in this Round</span>
                <div>
                  <input
                    type="text"
                    placeholder="Question title or problem statement..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Topic (e.g. Graphs, DP, Heap)"
                    value={questionTopic}
                    onChange={(e) => setQuestionTopic(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none"
                  />
                  <select
                    value={questionDifficulty}
                    onChange={(e) => setQuestionDifficulty(e.target.value)}
                    className="w-full px-2 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Your approach notes and complexity explanation..."
                    value={approachNotes}
                    onChange={(e) => setApproachNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-chip text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Key Takeaways & Advice (1 per line)</label>
                <textarea
                  rows="2"
                  placeholder="Communicate trade-offs before writing code&#10;Verify integer overflow bounds"
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
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
                  {isSubmitting ? 'Saving...' : 'Record Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

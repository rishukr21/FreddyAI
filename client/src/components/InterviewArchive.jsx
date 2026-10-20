import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  Star, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Layers,
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Company Interview Archive & Mocks
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Real campus placement rounds, technical problem deep dives, and key learnings from engineering interviewers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-white shadow-md shadow-purple-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            Log Interview Round
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
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCompany === c
                  ? 'bg-purple-500 text-white font-semibold'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Empty State or Interview Cards */}
      {interviews.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-gray-800 space-y-4">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-gray-200">No Interview Experiences Logged Yet</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Record technical questions from mock interviews, online assessments, and on-campus rounds to build your personalized placement cheat sheet.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Log Your First Interview
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((item) => (
            <div 
              key={item._id}
              className="glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 hover:border-purple-500/30 transition-all bg-gradient-to-br from-gray-900/50 via-gray-950/60 to-purple-950/10 shadow-xl"
            >
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg font-mono">
                    {item.company.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{item.company}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-medium">
                        {item.roundType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}/10
                  </span>
                </div>
              </div>

              {/* Experience Summary */}
              {item.experienceSummary && (
                <div className="mt-4">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.experienceSummary}
                  </p>
                </div>
              )}

              {/* Questions Asked */}
              {item.questionsAsked && item.questionsAsked.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Questions Posed by Interviewer
                  </h4>
                  <div className="space-y-2">
                    {item.questionsAsked.map((q, idx) => (
                      <div key={idx} className="bg-gray-950/60 p-4 rounded-2xl border border-gray-800/80 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-white">
                            "{q.questionText}"
                          </p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        {q.notes && (
                          <p className="text-xs text-gray-400 bg-gray-900/40 p-2.5 rounded-xl border border-gray-800/60 font-mono">
                            Approach: {q.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Learnings */}
              {item.keyLearnings && item.keyLearnings.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-800/80">
                  <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5" /> Interview Takeaways & Advice
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {item.keyLearnings.map((learning, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-gray-950/40 p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-gray-700 p-6 sm:p-7 max-h-[90vh] overflow-y-auto relative shadow-2xl bg-[#0f1422]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-gray-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Log Interview / Mock Experience</h3>
                <p className="text-xs text-gray-400">Record rounds, questions asked, and key interviewer feedback.</p>
              </div>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Amazon, Mock Interview"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="Software Engineer Intern / SDE-1"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Round Type</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
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
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Self-Rating (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Experience Summary</label>
                <textarea
                  rows="2"
                  placeholder="How did the round go? What was the interviewer's focus?"
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="bg-gray-950/40 p-3.5 rounded-2xl border border-gray-800/80 space-y-3">
                <span className="text-xs font-bold text-gray-300 block">Question Posed in this Round</span>
                <div>
                  <input
                    type="text"
                    placeholder="Question description or title..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Topic (e.g. Graphs, DP, Sliding Window)"
                    value={questionTopic}
                    onChange={(e) => setQuestionTopic(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                  <select
                    value={questionDifficulty}
                    onChange={(e) => setQuestionDifficulty(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Solution approach notes / edge cases..."
                    value={approachNotes}
                    onChange={(e) => setApproachNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Key Takeaways & Advice (1 per line)</label>
                <textarea
                  rows="2"
                  placeholder="Communicate edge cases before writing code&#10;Check integer overflow on multiplication"
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none resize-none"
                ></textarea>
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
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20"
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

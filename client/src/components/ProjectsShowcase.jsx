import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Terminal,
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectsShowcase({ projects = [], onProjectAdded, onOpenAuthModal }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [highlights, setHighlights] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddModal = () => {
    if (!isAuthenticated && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      techStack: techStack ? techStack.split(',').map(t => t.trim()).filter(Boolean) : ['React', 'Node.js'],
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim(),
      highlights: highlights ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : [],
      status: 'Completed',
      featured: true
    };

    try {
      const res = await authFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (onProjectAdded) onProjectAdded();
        setIsAddModalOpen(false);
        setTitle('');
        setTagline('');
        setDescription('');
        setTechStack('');
        setGithubUrl('');
        setLiveDemoUrl('');
        setHighlights('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to save project. Please sign in.');
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
            <FolderGit2 className="w-6 h-6 text-emerald-400" />
            Engineering Projects & Demos
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Production systems, distributed architectures, and full-stack software built for high scalability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-emerald-400 font-semibold">
            {projects.length} Showcased Projects
          </span>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-gray-800 space-y-4">
          <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-gray-200">No Projects Added Yet</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Showcase your distributed systems, MERN stack web apps, or open-source tools with architecture notes and live demos.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div 
              key={proj._id} 
              className="glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between group relative overflow-hidden bg-gradient-to-b from-gray-900/60 to-gray-950/80 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.featured && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{proj.tagline}</p>
                    </div>
                  </div>

                  {proj.starsCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-mono bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{proj.starsCount}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mt-3">
                  {proj.description}
                </p>

                {proj.highlights && proj.highlights.length > 0 && (
                  <div className="mt-4 space-y-1.5 bg-gray-950/60 p-3.5 rounded-2xl border border-gray-800/80">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-1">
                      Key Architectural Highlights:
                    </span>
                    {proj.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.techStack?.map((tech, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-900/90 text-gray-300 border border-gray-800 font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {proj.status || 'Active'}
                </span>

                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-200 font-medium transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
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
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add Project to Showcase</h3>
                <p className="text-xs text-gray-400">Display your system architecture, tech stack, and links.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Cache, CodeCollab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="One-line hook describing what it solves..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed overview of what you engineered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Redis, Docker, Tailwind"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.dev"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Key Highlights (1 per line)</label>
                <textarea
                  rows="2"
                  placeholder="Implemented Raft consensus log replication&#10;Zero-allocation memory recycler"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
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
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

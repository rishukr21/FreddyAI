import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Terminal,
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';
import Chip from './common/Chip';
import EmptyState from './common/EmptyState';

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
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-amber-500" />
            Engineering Projects & Demos
          </h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Production systems, distributed architectures, and full-stack software built for high scalability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-chip bg-surface-elevated border border-border text-amber-500">
            {projects.length} Showcased
          </span>
          <button
            onClick={handleOpenAddModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-chip text-sm font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No Projects Showcased Yet"
          description="Showcase your distributed systems, MERN stack web applications, or open-source tools with architectural highlights and live demo URLs."
          actionLabel="Add Your First Project"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div 
              key={proj._id} 
              className="bento-card p-6 sm:p-7 border-border hover:border-amber-500/35 transition-all flex flex-col justify-between group relative overflow-hidden bg-surface"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-amber-500 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.featured && (
                          <Chip 
                            label="Featured" 
                            variant="amber" 
                            size="sm" 
                            icon={Sparkles} 
                          />
                        )}
                      </div>
                      <p className="text-xs text-foreground-muted mt-0.5">{proj.tagline}</p>
                    </div>
                  </div>

                  {proj.starsCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-mono bg-surface-elevated px-2.5 py-1 rounded-chip border border-border">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{proj.starsCount}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-foreground-secondary leading-relaxed mt-3">
                  {proj.description}
                </p>

                {proj.highlights && proj.highlights.length > 0 && (
                  <div className="mt-4 space-y-1.5 bg-surface-elevated/60 p-3.5 rounded-subcard border border-border">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-foreground-muted block mb-1 font-heading">
                      Architectural Highlights:
                    </span>
                    {proj.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.techStack?.map((tech, i) => (
                    <Chip 
                      key={i} 
                      label={tech} 
                      variant="default" 
                      size="sm" 
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {proj.status || 'Active'}
                </span>

                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip bg-surface-elevated hover:bg-surface border border-border text-xs text-foreground font-medium transition-all"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-chip bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
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
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">Add Project to Showcase</h3>
                <p className="text-xs text-foreground-muted">Display system architecture, tech stack, and live links.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Key-Value Store, FreddyAI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="One-line hook describing architectural impact..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed overview of what you engineered, algorithms used, and benchmarks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500 resize-none font-sans"
                  required
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Redis, Docker, Go"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground-secondary block mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.dev"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-secondary block mb-1">Key Highlights (1 per line)</label>
                <textarea
                  rows="2"
                  placeholder="Implemented Raft consensus log replication&#10;Zero-allocation memory recycler"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-chip text-sm text-foreground focus:outline-none focus:border-amber-500 resize-none font-sans"
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

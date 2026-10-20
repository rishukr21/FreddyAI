import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveDemoUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  highlights: [{ type: String }],
  architectureDiagramUrl: { type: String, default: '' },
  starsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Completed', 'In Progress', 'V2 Planned'], default: 'Completed' }
}, {
  timestamps: true
});

export const Project = mongoose.model('Project', projectSchema);

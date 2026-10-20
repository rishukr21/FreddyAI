import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, default: 'Software Development Engineer' },
  roundType: { 
    type: String, 
    enum: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR / Managerial', 'Mock Interview'],
    default: 'Technical Round 1' 
  },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Completed', 'Upcoming', 'Archived'], default: 'Completed' },
  questionsAsked: [{
    questionText: String,
    topic: String,
    difficulty: String,
    wasAbleToSolve: Boolean,
    notes: String
  }],
  experienceSummary: { type: String, default: '' },
  keyLearnings: [{ type: String }],
  rating: { type: Number, min: 1, max: 10, default: 8 }
}, {
  timestamps: true
});

export const Interview = mongoose.model('Interview', interviewSchema);

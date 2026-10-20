import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  problemsSolvedCount: { type: Number, default: 0 },
  problems: [{
    title: String,
    difficulty: String,
    topic: String,
    platform: String
  }],
  studyHours: { type: Number, default: 0 },
  csFundamentals: [{ type: String }], // e.g. ["OS: Virtual Memory", "DBMS: Indexing"]
  projectWork: {
    projectName: String,
    taskDescription: String,
    commitsCount: Number
  },
  journalNotes: { type: String, default: '' },
  aiScore: {
    totalScore: { type: Number, min: 0, max: 100, default: 0 },
    breakdown: {
      problemSolving: Number,
      consistency: Number,
      breadthOfTopics: Number,
      depthAndFundamentals: Number
    },
    strengths: [String],
    weaknesses: [String],
    recommendation: String,
    tomorrowTarget: [String]
  }
}, {
  timestamps: true
});

export const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

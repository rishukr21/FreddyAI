import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true },
  problemUrl: { type: String, default: '' },
  platform: { type: String, enum: ['LeetCode', 'Codeforces', 'GeeksforGeeks', 'CodeChef', 'Other'], default: 'LeetCode' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  topic: { type: String, required: true },
  timeComplexity: { type: String, default: 'O(N)' },
  spaceComplexity: { type: String, default: 'O(1)' },
  approach: { type: String, default: '' },
  codeSnippet: { type: String, default: '' },
  status: { type: String, enum: ['Solved', 'Revisit', 'Mastered'], default: 'Solved' },
  solvedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  revisitNotes: { type: String, default: '' }
}, {
  timestamps: true
});

export const DsaProblem = mongoose.model('DsaProblem', dsaProblemSchema);

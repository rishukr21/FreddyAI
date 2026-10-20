import express from 'express';
import { getDBStatus } from '../config/db.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { DailyLog } from '../models/DailyLog.js';
import { Interview } from '../models/Interview.js';
import { Project } from '../models/Project.js';
import { evaluateDailyPerformance } from '../services/aiScorer.js';
import { fetchLeetCodeStats, fetchCodeforcesStats, fetchGithubStats } from '../services/statsFetcher.js';
import { initialProjects, initialDsaProblems, initialInterviews, initialDailyLogs } from '../services/mockStore.js';

const router = express.Router();

// In-memory store (empty by default)
let memoryStore = {
  projects: [...initialProjects],
  dsaProblems: [...initialDsaProblems],
  interviews: [...initialInterviews],
  dailyLogs: [...initialDailyLogs],
};

// --- 1. OVERVIEW & DASHBOARD STATS ---
router.get('/overview', async (req, res) => {
  try {
    let logs = [];
    let dsaCount = 0;
    let interviewCount = 0;
    let projectCount = 0;
    let recentProblems = [];

    if (getDBStatus()) {
      logs = await DailyLog.find().sort({ date: -1 }).limit(14);
      dsaCount = await DsaProblem.countDocuments();
      interviewCount = await Interview.countDocuments();
      projectCount = await Project.countDocuments();
      recentProblems = await DsaProblem.find().sort({ solvedAt: -1 }).limit(5);
    } else {
      logs = [...memoryStore.dailyLogs].sort((a, b) => b.date.localeCompare(a.date));
      dsaCount = memoryStore.dsaProblems.length;
      interviewCount = memoryStore.interviews.length;
      projectCount = memoryStore.projects.length;
      recentProblems = memoryStore.dsaProblems.slice(0, 5);
    }

    const latestLog = logs[0] || null;
    const streak = logs.length;

    res.json({
      success: true,
      data: {
        latestLog,
        streakDays: streak,
        totalDsaProblems: dsaCount,
        totalInterviews: interviewCount,
        totalProjects: projectCount,
        history: logs,
        recentProblems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 2. EXTERNAL STATS (LeetCode / Codeforces / GitHub) ---
router.get('/external-stats', async (req, res) => {
  try {
    const lcUser = req.query.leetcode || process.env.LEETCODE_USERNAME || '';
    const cfUser = req.query.codeforces || process.env.CODEFORCES_USERNAME || '';
    const ghUser = req.query.github || process.env.GITHUB_USERNAME || '';

    const [leetcode, codeforces, github] = await Promise.all([
      fetchLeetCodeStats(lcUser),
      fetchCodeforcesStats(cfUser),
      fetchGithubStats(ghUser)
    ]);

    res.json({
      success: true,
      data: {
        leetcode,
        codeforces,
        github
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 3. DSA PROBLEMS ---
router.get('/dsa', async (req, res) => {
  try {
    const { topic, difficulty, status, search } = req.query;

    if (getDBStatus()) {
      const query = {};
      if (topic && topic !== 'All') query.topic = topic;
      if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }
      const problems = await DsaProblem.find(query).sort({ solvedAt: -1 });
      return res.json({ success: true, count: problems.length, data: problems });
    }

    // In-memory filter
    let results = [...memoryStore.dsaProblems];
    if (topic && topic !== 'All') results = results.filter(p => p.topic === topic);
    if (difficulty && difficulty !== 'All') results = results.filter(p => p.difficulty === difficulty);
    if (status && status !== 'All') results = results.filter(p => p.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(q) || (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dsa', async (req, res) => {
  try {
    const problemData = req.body;
    if (getDBStatus()) {
      const created = await DsaProblem.create(problemData);
      return res.status(201).json({ success: true, data: created });
    }

    const newItem = {
      _id: 'd_' + Date.now(),
      solvedAt: new Date(),
      ...problemData
    };
    memoryStore.dsaProblems.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- 4. PROJECTS ---
router.get('/projects', async (req, res) => {
  try {
    if (getDBStatus()) {
      const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
      return res.json({ success: true, data: projects });
    }
    res.json({ success: true, data: memoryStore.projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const data = req.body;
    if (getDBStatus()) {
      const created = await Project.create(data);
      return res.status(201).json({ success: true, data: created });
    }
    const newItem = { _id: 'p_' + Date.now(), ...data };
    memoryStore.projects.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- 5. INTERVIEW VAULT ---
router.get('/interviews', async (req, res) => {
  try {
    if (getDBStatus()) {
      const interviews = await Interview.find().sort({ date: -1 });
      return res.json({ success: true, data: interviews });
    }
    res.json({ success: true, data: memoryStore.interviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/interviews', async (req, res) => {
  try {
    const data = req.body;
    if (getDBStatus()) {
      const created = await Interview.create(data);
      return res.status(201).json({ success: true, data: created });
    }
    const newItem = { _id: 'i_' + Date.now(), ...data };
    memoryStore.interviews.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- 6. DAILY LOGS & AI EVALUATION ---
router.get('/logs', async (req, res) => {
  try {
    if (getDBStatus()) {
      const logs = await DailyLog.find().sort({ date: -1 });
      return res.json({ success: true, data: logs });
    }
    res.json({ success: true, data: memoryStore.dailyLogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/logs', async (req, res) => {
  try {
    const logData = req.body;
    const date = logData.date || new Date().toISOString().split('T')[0];

    // Compute AI Placement Score
    const aiEvaluation = await evaluateDailyPerformance(logData);
    const completeLog = {
      ...logData,
      date,
      problemsSolvedCount: logData.problems?.length || 0,
      aiScore: aiEvaluation
    };

    if (getDBStatus()) {
      const updated = await DailyLog.findOneAndUpdate(
        { date },
        completeLog,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, data: updated });
    }

    // In-memory update or insert
    const idx = memoryStore.dailyLogs.findIndex(l => l.date === date);
    if (idx >= 0) {
      memoryStore.dailyLogs[idx] = { _id: memoryStore.dailyLogs[idx]._id, ...completeLog };
      return res.status(200).json({ success: true, data: memoryStore.dailyLogs[idx] });
    } else {
      const newLog = { _id: 'log_' + Date.now(), ...completeLog };
      memoryStore.dailyLogs.unshift(newLog);
      return res.status(201).json({ success: true, data: newLog });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Reset all memory state (clean slate)
router.post('/reset', (req, res) => {
  memoryStore = {
    projects: [],
    dsaProblems: [],
    interviews: [],
    dailyLogs: []
  };
  res.json({ success: true, message: 'All data cleared to empty state' });
});

export default router;

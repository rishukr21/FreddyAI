import express from 'express';
import { getDBStatus } from '../config/db.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { DailyLog } from '../models/DailyLog.js';
import { Interview } from '../models/Interview.js';
import { Project } from '../models/Project.js';
import { evaluateDailyPerformance } from '../services/aiScorer.js';
import { fetchLeetCodeStats, fetchCodeforcesStats, fetchGithubStats } from '../services/statsFetcher.js';
import { initialProjects, initialDsaProblems, initialInterviews, initialDailyLogs } from '../services/mockStore.js';
import { verifyAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// In-memory store (empty by default)
let memoryStore = {
  projects: [...initialProjects],
  dsaProblems: [...initialDsaProblems],
  interviews: [...initialInterviews],
  dailyLogs: [...initialDailyLogs],
};

// Helper to get active user ID from request (if logged in)
const getUserId = (req) => req.user?.id || req.query.userId || null;

// --- 1. OVERVIEW & DASHBOARD STATS ---
router.get('/overview', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    let logs = [];
    let dsaCount = 0;
    let interviewCount = 0;
    let projectCount = 0;
    let recentProblems = [];

    if (getDBStatus()) {
      const filter = userId ? { userId } : {};
      logs = await DailyLog.find(filter).sort({ date: -1 }).limit(14);
      dsaCount = await DsaProblem.countDocuments(filter);
      interviewCount = await Interview.countDocuments(filter);
      projectCount = await Project.countDocuments(filter);
      recentProblems = await DsaProblem.find(filter).sort({ solvedAt: -1 }).limit(5);
    } else {
      let filteredLogs = memoryStore.dailyLogs;
      let filteredDsa = memoryStore.dsaProblems;
      let filteredInt = memoryStore.interviews;
      let filteredProj = memoryStore.projects;

      if (userId) {
        filteredLogs = filteredLogs.filter(l => l.userId === userId);
        filteredDsa = filteredDsa.filter(d => d.userId === userId);
        filteredInt = filteredInt.filter(i => i.userId === userId);
        filteredProj = filteredProj.filter(p => p.userId === userId);
      }

      logs = [...filteredLogs].sort((a, b) => b.date.localeCompare(a.date));
      dsaCount = filteredDsa.length;
      interviewCount = filteredInt.length;
      projectCount = filteredProj.length;
      recentProblems = filteredDsa.slice(0, 5);
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
router.get('/external-stats', optionalAuth, async (req, res) => {
  try {
    const lcUser = req.query.leetcode || '';
    const cfUser = req.query.codeforces || '';
    const ghUser = req.query.github || '';

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
router.get('/dsa', optionalAuth, async (req, res) => {
  try {
    const { topic, difficulty, status, search } = req.query;
    const userId = getUserId(req);

    if (getDBStatus()) {
      const query = {};
      if (userId) query.userId = userId;
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
    if (userId) results = results.filter(p => p.userId === userId);
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

router.post('/dsa', verifyAuth, async (req, res) => {
  try {
    const problemData = { ...req.body, userId: req.user.id };
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
router.get('/projects', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (getDBStatus()) {
      const query = userId ? { userId } : {};
      const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });
      return res.json({ success: true, data: projects });
    }

    let results = memoryStore.projects;
    if (userId) results = results.filter(p => p.userId === userId);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/projects', verifyAuth, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
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
router.get('/interviews', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (getDBStatus()) {
      const query = userId ? { userId } : {};
      const interviews = await Interview.find(query).sort({ date: -1 });
      return res.json({ success: true, data: interviews });
    }

    let results = memoryStore.interviews;
    if (userId) results = results.filter(i => i.userId === userId);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/interviews', verifyAuth, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
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
router.get('/logs', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (getDBStatus()) {
      const query = userId ? { userId } : {};
      const logs = await DailyLog.find(query).sort({ date: -1 });
      return res.json({ success: true, data: logs });
    }

    let results = memoryStore.dailyLogs;
    if (userId) results = results.filter(l => l.userId === userId);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/logs', verifyAuth, async (req, res) => {
  try {
    const logData = req.body;
    const userId = req.user.id;
    const date = logData.date || new Date().toISOString().split('T')[0];

    // Compute AI Placement Score
    const aiEvaluation = await evaluateDailyPerformance(logData);
    const completeLog = {
      ...logData,
      userId,
      date,
      problemsSolvedCount: logData.problems?.length || 0,
      aiScore: aiEvaluation
    };

    if (getDBStatus()) {
      const updated = await DailyLog.findOneAndUpdate(
        { userId, date },
        completeLog,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(201).json({ success: true, data: updated });
    }

    // In-memory update or insert
    const idx = memoryStore.dailyLogs.findIndex(l => l.userId === userId && l.date === date);
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

import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';
import { generateToken, verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Fallback in-memory user registry when MongoDB is offline
const memoryUsers = [];

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole, targetCompany, leetcodeUsername, codeforcesUsername, githubUsername } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        targetRole: targetRole || 'Software Development Engineer',
        targetCompany: targetCompany || 'Top Product Companies',
        leetcodeUsername: leetcodeUsername?.trim() || '',
        codeforcesUsername: codeforcesUsername?.trim() || '',
        githubUsername: githubUsername?.trim() || ''
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          targetCompany: user.targetCompany,
          leetcodeUsername: user.leetcodeUsername,
          codeforcesUsername: user.codeforcesUsername,
          githubUsername: user.githubUsername
        }
      });
    }

    // In-memory fallback
    const exists = memoryUsers.find(u => u.email === normalizedEmail);
    if (exists) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      targetRole: targetRole || 'Software Development Engineer',
      targetCompany: targetCompany || 'Top Product Companies',
      leetcodeUsername: leetcodeUsername?.trim() || '',
      codeforcesUsername: codeforcesUsername?.trim() || '',
      githubUsername: githubUsername?.trim() || ''
    };
    memoryUsers.push(newUser);

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        targetCompany: newUser.targetCompany,
        leetcodeUsername: newUser.leetcodeUsername,
        codeforcesUsername: newUser.codeforcesUsername,
        githubUsername: newUser.githubUsername
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          targetCompany: user.targetCompany,
          leetcodeUsername: user.leetcodeUsername,
          codeforcesUsername: user.codeforcesUsername,
          githubUsername: user.githubUsername
        }
      });
    }

    // In-memory fallback
    const user = memoryUsers.find(u => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        targetCompany: user.targetCompany,
        leetcodeUsername: user.leetcodeUsername,
        codeforcesUsername: user.codeforcesUsername,
        githubUsername: user.githubUsername
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET CURRENT USER
router.get('/me', verifyAuth, async (req, res) => {
  try {
    if (getDBStatus()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, user });
    }

    const user = memoryUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. UPDATE PROFILE HANDLES
router.put('/profile', verifyAuth, async (req, res) => {
  try {
    const { name, targetRole, targetCompany, leetcodeUsername, codeforcesUsername, githubUsername } = req.body;

    if (getDBStatus()) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...(name && { name: name.trim() }),
          ...(targetRole && { targetRole: targetRole.trim() }),
          ...(targetCompany && { targetCompany: targetCompany.trim() }),
          ...(leetcodeUsername !== undefined && { leetcodeUsername: leetcodeUsername.trim() }),
          ...(codeforcesUsername !== undefined && { codeforcesUsername: codeforcesUsername.trim() }),
          ...(githubUsername !== undefined && { githubUsername: githubUsername.trim() }),
        },
        { new: true }
      ).select('-password');

      return res.json({ success: true, user });
    }

    const user = memoryUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (name) user.name = name.trim();
    if (targetRole) user.targetRole = targetRole.trim();
    if (targetCompany) user.targetCompany = targetCompany.trim();
    if (leetcodeUsername !== undefined) user.leetcodeUsername = leetcodeUsername.trim();
    if (codeforcesUsername !== undefined) user.codeforcesUsername = codeforcesUsername.trim();
    if (githubUsername !== undefined) user.githubUsername = githubUsername.trim();

    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

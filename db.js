const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, 'data', 'notebook.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Enable WAL mode for smooth concurrent reads and writes
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL DEFAULT '📁',
      color TEXT NOT NULL DEFAULT '#6366f1',
      description TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      note_type TEXT DEFAULT 'general',
      is_pinned INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      color TEXT DEFAULT 'default',
      priority TEXT DEFAULT 'medium',
      tags TEXT DEFAULT '[]',
      metadata TEXT DEFAULT '{}',
      checklist_items TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category_id);
    CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
    CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(note_type);
  `);

  // Seed default data if empty
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (catCount === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, icon, color, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const categories = [
    { name: 'Movies to Watch', slug: 'movies-to-watch', icon: '🎬', color: '#f43f5e', description: 'Films, series & watchlist with ratings and platform info', order: 1 },
    { name: 'Daily Study', slug: 'daily-study', icon: '📚', color: '#3b82f6', description: 'Daily study goals, revision checklists, and learning roadmaps', order: 2 },
    { name: 'Ideas & Brainstorming', slug: 'ideas', icon: '💡', color: '#eab308', description: 'Creative concepts, project sparks, and innovation notes', order: 3 },
    { name: 'Work & Projects', slug: 'work-projects', icon: '💼', color: '#10b981', description: 'Work deliverables, project tasks, and architecture plans', order: 4 },
    { name: 'Personal & Health', slug: 'personal-health', icon: '🌱', color: '#8b5cf6', description: 'Habits, journaling, fitness, and personal reflections', order: 5 }
  ];

  const catMap = {};
  for (const cat of categories) {
    const res = insertCat.run(cat.name, cat.slug, cat.icon, cat.color, cat.description, cat.order);
    catMap[cat.slug] = Number(res.lastInsertRowid);
  }

  const insertNote = db.prepare(`
    INSERT INTO notes (title, content, category_id, note_type, is_pinned, color, priority, tags, metadata, checklist_items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Movie Notes
  insertNote.run(
    'Interstellar (2014)',
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. Stunning visuals and masterclass soundtrack by Hans Zimmer.',
    catMap['movies-to-watch'],
    'movie',
    1,
    '#ffe4e6',
    'high',
    JSON.stringify(['sci-fi', 'space', 'nolan']),
    JSON.stringify({
      genre: 'Sci-Fi / Adventure',
      director: 'Christopher Nolan',
      year: 2014,
      platform: 'Prime Video',
      status: 'watched',
      rating: 5
    }),
    JSON.stringify([
      { id: '1', text: 'Watch with 5.1 surround sound or good headphones', completed: true },
      { id: '2', text: 'Read the science behind Gargantua black hole', completed: true }
    ])
  );

  insertNote.run(
    'Spirited Away (2001)',
    'During her family\'s move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches, and spirits where humans are changed into beasts.',
    catMap['movies-to-watch'],
    'movie',
    0,
    '#fef3c7',
    'medium',
    JSON.stringify(['animation', 'ghibli', 'fantasy']),
    JSON.stringify({
      genre: 'Animation / Fantasy',
      director: 'Hayao Miyazaki',
      year: 2001,
      platform: 'Netflix',
      status: 'plan_to_watch',
      rating: 5
    }),
    JSON.stringify([
      { id: '1', text: 'Watch Japanese audio with subtitles', completed: false },
      { id: '2', text: 'Explore Studio Ghibli art book afterwards', completed: false }
    ])
  );

  insertNote.run(
    'Dune: Part Two (2024)',
    'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    catMap['movies-to-watch'],
    'movie',
    0,
    '#ffedd5',
    'high',
    JSON.stringify(['sci-fi', 'epic']),
    JSON.stringify({
      genre: 'Sci-Fi / Action',
      director: 'Denis Villeneuve',
      year: 2024,
      platform: 'Apple TV / Theater',
      status: 'plan_to_watch',
      rating: 5
    }),
    JSON.stringify([
      { id: '1', text: 'Watch IMAX format if available', completed: false }
    ])
  );

  // 2. Daily Study Notes
  insertNote.run(
    'Daily Engineering & Study Routine',
    'Core daily study checklist to maintain consistency and level up software engineering fundamentals every day.',
    catMap['daily-study'],
    'study',
    1,
    '#dbeafe',
    'high',
    JSON.stringify(['daily', 'leetcode', 'system-design']),
    JSON.stringify({
      frequency: 'Daily',
      targetMinutes: 90,
      streak: 5
    }),
    JSON.stringify([
      { id: '1', text: 'Solve 2 LeetCode problems (Graphs & DP)', completed: true },
      { id: '2', text: 'Read 1 Chapter of Designing Data-Intensive Applications', completed: false },
      { id: '3', text: 'Review Node.js Event Loop and Concurrency internals', completed: true },
      { id: '4', text: '30 mins hands-on project coding', completed: false }
    ])
  );

  insertNote.run(
    'Modern Web & System Architecture Revision',
    'Key topics to revise this week:\n- Event-driven microservices\n- Redis caching patterns (Cache-Aside, Write-Through)\n- Database indexing B-Trees vs LSM Trees\n- WebSockets vs Server-Sent Events',
    catMap['daily-study'],
    'study',
    0,
    '#e0e7ff',
    'medium',
    JSON.stringify(['architecture', 'revision']),
    JSON.stringify({
      frequency: 'Weekly',
      targetMinutes: 60
    }),
    JSON.stringify([
      { id: '1', text: 'Summarize B-Tree vs Hash Index trade-offs', completed: true },
      { id: '2', text: 'Draw diagram for distributed locking with Redis', completed: false },
      { id: '3', text: 'Practice SQL query optimization with EXPLAIN ANALYZE', completed: false }
    ])
  );

  // 3. Ideas Note
  insertNote.run(
    'Smart Notebook 2.0 Feature Concepts',
    'Ideas for expanding the notebook:\n- Instant search with tag chips\n- Category color theming\n- Movie rating stars & streaming links\n- Daily habit checklist reset button\n- Offline-first SQLite persistence',
    catMap['ideas'],
    'general',
    0,
    '#fef08a',
    'medium',
    JSON.stringify(['roadmap', 'app-ideas']),
    JSON.stringify({}),
    JSON.stringify([])
  );
}

// Helpers for serializing/deserializing note records
function formatNote(row) {
  if (!row) return null;
  return {
    ...row,
    is_pinned: Boolean(row.is_pinned),
    is_archived: Boolean(row.is_archived),
    tags: safeJsonParse(row.tags, []),
    metadata: safeJsonParse(row.metadata, {}),
    checklist_items: safeJsonParse(row.checklist_items, [])
  };
}

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str || '{}');
  } catch {
    return fallback;
  }
}

// Category CRUD
function getCategories() {
  const query = `
    SELECT c.*, 
      COUNT(n.id) as note_count
    FROM categories c
    LEFT JOIN notes n ON n.category_id = c.id AND n.is_archived = 0
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `;
  return db.prepare(query).all();
}

function getCategoryById(id) {
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(Number(id));
}

function createCategory({ name, icon = '📁', color = '#6366f1', description = '' }) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM categories').get().m || 0;
  
  const stmt = db.prepare(`
    INSERT INTO categories (name, slug, icon, color, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const res = stmt.run(name.trim(), slug, icon, color, description.trim(), maxOrder + 1);
  return getCategoryById(res.lastInsertRowid);
}

function updateCategory(id, { name, icon, color, description }) {
  const current = getCategoryById(id);
  if (!current) return null;

  const newName = name !== undefined ? name.trim() : current.name;
  const newIcon = icon !== undefined ? icon : current.icon;
  const newColor = color !== undefined ? color : current.color;
  const newDesc = description !== undefined ? description.trim() : current.description;

  db.prepare(`
    UPDATE categories
    SET name = ?, icon = ?, color = ?, description = ?
    WHERE id = ?
  `).run(newName, newIcon, newColor, newDesc, Number(id));

  return getCategoryById(id);
}

function deleteCategory(id) {
  // Set notes with this category to NULL so notes are never lost accidentally
  db.prepare('UPDATE notes SET category_id = NULL WHERE category_id = ?').run(Number(id));
  const res = db.prepare('DELETE FROM categories WHERE id = ?').run(Number(id));
  return res.changes > 0;
}

// Note CRUD
function getNotes({ category_id, search, note_type, priority, is_pinned, is_archived = 0, sort_by = 'pinned_updated' } = {}) {
  let whereClauses = ['n.is_archived = ?'];
  let params = [is_archived ? 1 : 0];

  if (category_id !== undefined && category_id !== null && category_id !== '' && category_id !== 'all') {
    if (category_id === 'uncategorized') {
      whereClauses.push('n.category_id IS NULL');
    } else {
      whereClauses.push('n.category_id = ?');
      params.push(Number(category_id));
    }
  }

  if (note_type && note_type !== 'all') {
    whereClauses.push('n.note_type = ?');
    params.push(note_type);
  }

  if (priority && priority !== 'all') {
    whereClauses.push('n.priority = ?');
    params.push(priority);
  }

  if (is_pinned !== undefined && is_pinned !== null && is_pinned !== '') {
    whereClauses.push('n.is_pinned = ?');
    params.push(is_pinned ? 1 : 0);
  }

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    whereClauses.push('(n.title LIKE ? OR n.content LIKE ? OR n.tags LIKE ? OR n.metadata LIKE ?)');
    params.push(s, s, s, s);
  }

  let orderBy = 'n.is_pinned DESC, n.updated_at DESC';
  if (sort_by === 'newest') {
    orderBy = 'n.created_at DESC';
  } else if (sort_by === 'oldest') {
    orderBy = 'n.created_at ASC';
  } else if (sort_by === 'alphabetical') {
    orderBy = 'n.title ASC';
  } else if (sort_by === 'priority') {
    orderBy = `CASE n.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END ASC, n.updated_at DESC`;
  }

  const query = `
    SELECT n.*, 
           c.name as category_name, 
           c.icon as category_icon, 
           c.color as category_color
    FROM notes n
    LEFT JOIN categories c ON n.category_id = c.id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY ${orderBy}
  `;

  const rows = db.prepare(query).all(...params);
  return rows.map(formatNote);
}

function getNoteById(id) {
  const query = `
    SELECT n.*, 
           c.name as category_name, 
           c.icon as category_icon, 
           c.color as category_color
    FROM notes n
    LEFT JOIN categories c ON n.category_id = c.id
    WHERE n.id = ?
  `;
  const row = db.prepare(query).get(Number(id));
  return formatNote(row);
}

function createNote(data) {
  const {
    title,
    content = '',
    category_id = null,
    note_type = 'general',
    is_pinned = 0,
    color = 'default',
    priority = 'medium',
    tags = [],
    metadata = {},
    checklist_items = []
  } = data;

  const stmt = db.prepare(`
    INSERT INTO notes (
      title, content, category_id, note_type, is_pinned, 
      color, priority, tags, metadata, checklist_items,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const catId = category_id ? Number(category_id) : null;
  const res = stmt.run(
    title.trim(),
    content,
    catId,
    note_type,
    is_pinned ? 1 : 0,
    color,
    priority,
    JSON.stringify(Array.isArray(tags) ? tags : []),
    JSON.stringify(typeof metadata === 'object' && metadata !== null ? metadata : {}),
    JSON.stringify(Array.isArray(checklist_items) ? checklist_items : [])
  );

  return getNoteById(res.lastInsertRowid);
}

function updateNote(id, data) {
  const existing = getNoteById(id);
  if (!existing) return null;

  const title = data.title !== undefined ? data.title.trim() : existing.title;
  const content = data.content !== undefined ? data.content : existing.content;
  const category_id = data.category_id !== undefined ? (data.category_id ? Number(data.category_id) : null) : existing.category_id;
  const note_type = data.note_type !== undefined ? data.note_type : existing.note_type;
  const is_pinned = data.is_pinned !== undefined ? (data.is_pinned ? 1 : 0) : (existing.is_pinned ? 1 : 0);
  const color = data.color !== undefined ? data.color : existing.color;
  const priority = data.priority !== undefined ? data.priority : existing.priority;
  const tags = data.tags !== undefined ? JSON.stringify(data.tags) : JSON.stringify(existing.tags);
  const metadata = data.metadata !== undefined ? JSON.stringify(data.metadata) : JSON.stringify(existing.metadata);
  const checklist_items = data.checklist_items !== undefined ? JSON.stringify(data.checklist_items) : JSON.stringify(existing.checklist_items);

  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, category_id = ?, note_type = ?, is_pinned = ?,
        color = ?, priority = ?, tags = ?, metadata = ?, checklist_items = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title, content, category_id, note_type, is_pinned,
    color, priority, tags, metadata, checklist_items,
    Number(id)
  );

  return getNoteById(id);
}

function deleteNote(id) {
  const res = db.prepare('DELETE FROM notes WHERE id = ?').run(Number(id));
  return res.changes > 0;
}

function togglePin(id) {
  const existing = getNoteById(id);
  if (!existing) return null;
  const newPinned = existing.is_pinned ? 0 : 1;
  db.prepare('UPDATE notes SET is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newPinned, Number(id));
  return getNoteById(id);
}

function toggleChecklistItem(noteId, itemIndex, completed) {
  const note = getNoteById(noteId);
  if (!note) return null;

  const items = [...note.checklist_items];
  if (items[itemIndex]) {
    items[itemIndex].completed = completed !== undefined ? Boolean(completed) : !items[itemIndex].completed;
  }

  db.prepare(`
    UPDATE notes 
    SET checklist_items = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(JSON.stringify(items), Number(noteId));

  return getNoteById(noteId);
}

function resetChecklist(noteId) {
  const note = getNoteById(noteId);
  if (!note) return null;

  const items = note.checklist_items.map(item => ({ ...item, completed: false }));
  db.prepare(`
    UPDATE notes 
    SET checklist_items = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(JSON.stringify(items), Number(noteId));

  return getNoteById(noteId);
}

function getStats() {
  const totalNotes = db.prepare('SELECT COUNT(*) as count FROM notes WHERE is_archived = 0').get().count;
  const pinnedNotes = db.prepare('SELECT COUNT(*) as count FROM notes WHERE is_pinned = 1 AND is_archived = 0').get().count;
  const movieNotes = db.prepare("SELECT COUNT(*) as count FROM notes WHERE note_type = 'movie' AND is_archived = 0").get().count;
  const studyNotes = db.prepare("SELECT COUNT(*) as count FROM notes WHERE note_type = 'study' AND is_archived = 0").get().count;

  // Movies watched vs to watch
  const movies = db.prepare("SELECT metadata FROM notes WHERE note_type = 'movie' AND is_archived = 0").all();
  let moviesWatched = 0;
  let moviesToWatch = 0;
  for (const m of movies) {
    const meta = safeJsonParse(m.metadata, {});
    if (meta.status === 'watched') moviesWatched++;
    else moviesToWatch++;
  }

  // Daily study tasks
  const studyList = db.prepare("SELECT checklist_items FROM notes WHERE note_type = 'study' AND is_archived = 0").all();
  let totalTasks = 0;
  let completedTasks = 0;
  for (const s of studyList) {
    const items = safeJsonParse(s.checklist_items, []);
    for (const it of items) {
      totalTasks++;
      if (it.completed) completedTasks++;
    }
  }

  return {
    totalNotes,
    pinnedNotes,
    movieNotes,
    moviesWatched,
    moviesToWatch,
    studyNotes,
    totalTasks,
    completedTasks
  };
}

function exportData() {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  const notes = db.prepare('SELECT * FROM notes').all().map(formatNote);
  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    categories,
    notes
  };
}

function importData(data) {
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.notes)) {
    throw new Error('Invalid backup file format');
  }

  // Clear existing or upsert
  db.exec('DELETE FROM notes');
  db.exec('DELETE FROM categories');

  const insertCat = db.prepare(`
    INSERT INTO categories (id, name, slug, icon, color, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cat of data.categories) {
    insertCat.run(cat.id, cat.name, cat.slug, cat.icon, cat.color, cat.description || '', cat.sort_order || 0);
  }

  const insertNote = db.prepare(`
    INSERT INTO notes (
      id, title, content, category_id, note_type, is_pinned, is_archived,
      color, priority, tags, metadata, checklist_items, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const note of data.notes) {
    insertNote.run(
      note.id,
      note.title,
      note.content || '',
      note.category_id || null,
      note.note_type || 'general',
      note.is_pinned ? 1 : 0,
      note.is_archived ? 1 : 0,
      note.color || 'default',
      note.priority || 'medium',
      JSON.stringify(note.tags || []),
      JSON.stringify(note.metadata || {}),
      JSON.stringify(note.checklist_items || []),
      note.created_at || new Date().toISOString(),
      note.updated_at || new Date().toISOString()
    );
  }

  return { success: true, categoriesCount: data.categories.length, notesCount: data.notes.length };
}

// Initialize on require
initSchema();

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleChecklistItem,
  resetChecklist,
  getStats,
  exportData,
  importData
};

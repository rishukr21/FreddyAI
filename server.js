const http = require('node:http');
const url = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const db = require('./db.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  // Security: Prevent directory traversal outside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for single-page routing or 404
      if (pathname.startsWith('/api')) {
        return sendJson(res, 404, { error: 'API route not found' });
      }
      // Return 404 page or index
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return fs.createReadStream(indexPath).pipe(res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    // API Routes
    if (pathname.startsWith('/api/')) {
      // --- CATEGORIES ---
      if (pathname === '/api/categories' && method === 'GET') {
        const categories = db.getCategories();
        return sendJson(res, 200, { categories });
      }

      if (pathname === '/api/categories' && method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.name || !body.name.trim()) {
          return sendJson(res, 400, { error: 'Category name is required' });
        }
        try {
          const category = db.createCategory(body);
          return sendJson(res, 201, { category });
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      const catMatch = pathname.match(/^\/api\/categories\/(\d+)$/);
      if (catMatch) {
        const catId = Number(catMatch[1]);
        if (method === 'GET') {
          const cat = db.getCategoryById(catId);
          return cat ? sendJson(res, 200, { category: cat }) : sendJson(res, 404, { error: 'Category not found' });
        }
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateCategory(catId, body);
          return updated ? sendJson(res, 200, { category: updated }) : sendJson(res, 404, { error: 'Category not found' });
        }
        if (method === 'DELETE') {
          const success = db.deleteCategory(catId);
          return sendJson(res, 200, { success });
        }
      }

      // --- NOTES ---
      if (pathname === '/api/notes' && method === 'GET') {
        const queryParams = parsedUrl.query;
        const notes = db.getNotes({
          category_id: queryParams.category_id,
          search: queryParams.search,
          note_type: queryParams.note_type,
          priority: queryParams.priority,
          is_pinned: queryParams.is_pinned !== undefined ? queryParams.is_pinned === '1' : undefined,
          sort_by: queryParams.sort_by
        });
        return sendJson(res, 200, { notes });
      }

      if (pathname === '/api/notes' && method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.title || !body.title.trim()) {
          return sendJson(res, 400, { error: 'Note title is required' });
        }
        const note = db.createNote(body);
        return sendJson(res, 201, { note });
      }

      const notePinMatch = pathname.match(/^\/api\/notes\/(\d+)\/pin$/);
      if (notePinMatch && method === 'PATCH') {
        const noteId = Number(notePinMatch[1]);
        const updated = db.togglePin(noteId);
        return updated ? sendJson(res, 200, { note: updated }) : sendJson(res, 404, { error: 'Note not found' });
      }

      const noteChecklistMatch = pathname.match(/^\/api\/notes\/(\d+)\/checklist$/);
      if (noteChecklistMatch && method === 'PATCH') {
        const noteId = Number(noteChecklistMatch[1]);
        const body = await parseJsonBody(req);
        const { itemIndex, completed } = body;
        if (itemIndex === undefined) {
          return sendJson(res, 400, { error: 'itemIndex is required' });
        }
        const updated = db.toggleChecklistItem(noteId, itemIndex, completed);
        return updated ? sendJson(res, 200, { note: updated }) : sendJson(res, 404, { error: 'Note not found' });
      }

      const noteResetMatch = pathname.match(/^\/api\/notes\/(\d+)\/checklist\/reset$/);
      if (noteResetMatch && method === 'POST') {
        const noteId = Number(noteResetMatch[1]);
        const updated = db.resetChecklist(noteId);
        return updated ? sendJson(res, 200, { note: updated }) : sendJson(res, 404, { error: 'Note not found' });
      }

      const noteMatch = pathname.match(/^\/api\/notes\/(\d+)$/);
      if (noteMatch) {
        const noteId = Number(noteMatch[1]);
        if (method === 'GET') {
          const note = db.getNoteById(noteId);
          return note ? sendJson(res, 200, { note }) : sendJson(res, 404, { error: 'Note not found' });
        }
        if (method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateNote(noteId, body);
          return updated ? sendJson(res, 200, { note: updated }) : sendJson(res, 404, { error: 'Note not found' });
        }
        if (method === 'DELETE') {
          const success = db.deleteNote(noteId);
          return sendJson(res, 200, { success });
        }
      }

      // --- STATS ---
      if (pathname === '/api/stats' && method === 'GET') {
        const stats = db.getStats();
        return sendJson(res, 200, { stats });
      }

      // --- EXPORT & IMPORT ---
      if (pathname === '/api/export' && method === 'GET') {
        const data = db.exportData();
        return sendJson(res, 200, data);
      }

      if (pathname === '/api/import' && method === 'POST') {
        const body = await parseJsonBody(req);
        try {
          const result = db.importData(body);
          return sendJson(res, 200, result);
        } catch (err) {
          return sendJson(res, 400, { error: err.message });
        }
      }

      return sendJson(res, 404, { error: 'Endpoint not found' });
    }

    // Serve static files
    serveStatic(req, res, pathname);
  } catch (error) {
    console.error('Server error:', error);
    sendJson(res, 500, { error: 'Internal server error: ' + error.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Notebook System server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => process.exit(0));
});

module.exports = server;

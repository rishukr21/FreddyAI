# 📓 NoteFlow — Category Notebook System

A modern, fast, and lightweight category-wise notebook system designed specifically for organizing notes into structured categories, tracking movies to watch, maintaining daily study routines, and capturing ideas.

Powered by **Node.js (v24)** and native **SQLite** (`node:sqlite`) with **zero external npm dependencies**.

---

## ✨ Key Features

### 1. 🗂️ Category-Wise Organization
- Organize notes into custom categories with dedicated emojis/icons and color palettes.
- Preloaded categories:
  - 🎬 **Movies to Watch**
  - 📚 **Daily Study**
  - 💡 **Ideas & Brainstorming**
  - 💼 **Work & Projects**
  - 🌱 **Personal & Health**
- Add, edit, or delete categories at any time with the built-in Category Manager.
- Filter notes by category, type, and priority with instant live counts.

### 2. 🎬 Movie Watchlist & Tracker
- Specialized note layout for movies and TV series.
- Track:
  - **Watch Status**: *Plan to Watch*, *Watching Now*, *Watched*, *Favorite*.
  - **Star Rating**: 1 to 5 stars.
  - **Streaming Platform**: Netflix, Prime Video, Apple TV, Theater, etc.
  - **Genre & Release Year**: e.g., Sci-Fi, Christopher Nolan (2014).
  - **Movie Notes & Reviews**.
- One-click status toggling directly from the card.

### 3. 📚 Daily Study Checklist & Habit Tracker
- Dedicated study tracker for daily preparation (DSA, System Design, Certifications, etc.).
- **Interactive Checkboxes**: Click items directly on the note card to mark them done—updates the database instantly without opening the editor.
- **Dynamic Progress Bar**: Real-time completion percentage (e.g. `3 of 4 done (75%)`).
- **"🔄 Reset for Today" Button**: One-click daily reset to uncheck all items for your next study session.
- Track study cadence (Daily, Weekdays, Weekly) and target daily study minutes.

### 4. 🔍 Instant Search & Filtering
- Live real-time search across titles, content, tags, movie metadata, and categories.
- Filter by:
  - **Type**: Standard Notes, Movies, Study Checklists.
  - **Priority**: High (🔴), Medium (🟡), Low (🟢).
  - **Sort**: Pinned & Updated, Newest First, Oldest First, Alphabetical (A-Z), Priority.
- Toggle between **Grid View (🔲)** and **List View (📋)**.

### 5. 📌 Pinning & Visual Customization
- Pin important notes to the top with glow indicators.
- Custom card tints (Rose, Blue, Amber, Mint, Lavender) for visual grouping.
- Markdown toolbar for bold, italic, bullet lists, code blocks, and blockquotes.

### 6. 🌙 Dark Mode & Backup
- Seamless dark and light themes with preference saved in `localStorage`.
- Full JSON export and restore for data backup.

---

## 🚀 Quick Start

### 1. Run the Server
Ensure you have Node.js (v22+ or v24+) installed:

```bash
npm start
# or
node server.js
```

### 2. Open in Your Browser
Visit:
```
http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Cmd/Ctrl + K` or `/` | Focus search bar |
| `Cmd/Ctrl + N` | Create a new note |
| `Escape` | Close any active modal or drawer |

---

## 📁 Project Architecture

```
Notebook-system-antigravity/
├── server.js              # Native Node.js HTTP server & RESTful API router
├── db.js                  # Native SQLite (node:sqlite) schema, queries, seeds & WAL mode
├── data/
│   └── notebook.db        # Local SQLite database (auto-created with sample data)
├── public/
│   ├── index.html         # Semantic HTML5 single-page application interface
│   ├── css/
│   │   └── style.css      # Modern SaaS design system with CSS variables & responsive layout
│   └── js/
│       ├── api.js         # Client-side API fetch client
│       └── app.js         # Reactive UI state, category manager, modal handlers & shortcuts
├── package.json           # Scripts and project metadata (0 external npm dependencies)
└── README.md              # Documentation and guide
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all categories with note counts |
| `POST` | `/api/categories` | Create a new category |
| `PUT` | `/api/categories/:id` | Update a category (name, icon, color, desc) |
| `DELETE` | `/api/categories/:id` | Delete a category (notes are safely kept) |
| `GET` | `/api/notes` | Query notes with search, category, type, and priority filters |
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes/:id` | Fetch a single note |
| `PUT` | `/api/notes/:id` | Update an existing note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `PATCH` | `/api/notes/:id/pin` | Toggle pin status |
| `PATCH` | `/api/notes/:id/checklist` | Toggle checklist item completion |
| `POST` | `/api/notes/:id/checklist/reset` | Reset study checklist for the day |
| `GET` | `/api/stats` | Overview counts (total notes, movies watched, study tasks) |
| `GET` | `/api/export` | Download complete JSON backup |
| `POST` | `/api/import` | Restore from JSON backup |

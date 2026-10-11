/**
 * NoteFlow Application Logic
 */

// Application State
const state = {
  categories: [],
  notes: [],
  stats: {},
  currentCategory: null,     // null = All, number = categoryId, 'uncategorized'
  currentView: 'all',        // 'all' | 'pinned' | 'movie' | 'study'
  filterType: 'all',         // 'all' | 'general' | 'movie' | 'study'
  filterPriority: 'all',     // 'all' | 'high' | 'medium' | 'low'
  sortBy: 'pinned_updated',
  searchQuery: '',
  viewMode: 'grid',          // 'grid' | 'list'
  theme: localStorage.getItem('noteflow_theme') || 'light',
  editingNoteId: null,
  activeNoteType: 'general',
  checklistBuilderItems: []
};

// DOM Element References
const elements = {
  // Navigation & Lists
  categoriesList: document.getElementById('categoriesList'),
  quickViewsList: document.getElementById('quickViewsList'),
  notesContainer: document.getElementById('notesContainer'),
  emptyState: document.getElementById('emptyState'),
  
  // Headers & Titles
  currentViewTitle: document.getElementById('currentViewTitle'),
  currentViewSubtitle: document.getElementById('currentViewSubtitle'),
  activeCategoryBanner: document.getElementById('activeCategoryBanner'),
  activeCatIcon: document.getElementById('activeCatIcon'),
  activeCatTitle: document.getElementById('activeCatTitle'),
  activeCatDesc: document.getElementById('activeCatDesc'),
  activeCatEditBtn: document.getElementById('activeCatEditBtn'),
  activeCatClearBtn: document.getElementById('activeCatClearBtn'),

  // Badges & Stats
  badgeAllCount: document.getElementById('badgeAllCount'),
  badgePinnedCount: document.getElementById('badgePinnedCount'),
  badgeMovieCount: document.getElementById('badgeMovieCount'),
  badgeStudyCount: document.getElementById('badgeStudyCount'),
  statCountNotes: document.getElementById('statCountNotes'),
  statWatchedMovies: document.getElementById('statWatchedMovies'),
  statTotalMovies: document.getElementById('statTotalMovies'),
  statDoneTasks: document.getElementById('statDoneTasks'),
  statTotalTasks: document.getElementById('statTotalTasks'),

  // Search & Filters
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  filterType: document.getElementById('filterType'),
  filterPriority: document.getElementById('filterPriority'),
  sortBy: document.getElementById('sortBy'),
  gridViewBtn: document.getElementById('gridViewBtn'),
  listViewBtn: document.getElementById('listViewBtn'),

  // Buttons & Modals
  newNoteBtn: document.getElementById('newNoteBtn'),
  headerNewNoteBtn: document.getElementById('headerNewNoteBtn'),
  emptyStateNewNoteBtn: document.getElementById('emptyStateNewNoteBtn'),
  addCategoryBtn: document.getElementById('addCategoryBtn'),
  manageCategoriesBtn: document.getElementById('manageCategoriesBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  themeLabel: document.getElementById('themeLabel'),
  backupModalBtn: document.getElementById('backupModalBtn'),
  sidebar: document.getElementById('sidebar'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),

  // Note Modal Elements
  noteModal: document.getElementById('noteModal'),
  noteForm: document.getElementById('noteForm'),
  noteModalTitle: document.getElementById('noteModalTitle'),
  closeNoteModalBtn: document.getElementById('closeNoteModalBtn'),
  cancelNoteModalBtn: document.getElementById('cancelNoteModalBtn'),
  noteId: document.getElementById('noteId'),
  formNoteTitle: document.getElementById('formNoteTitle'),
  formNoteCategory: document.getElementById('formNoteCategory'),
  formNotePriority: document.getElementById('formNotePriority'),
  formNoteColor: document.getElementById('formNoteColor'),
  formNoteContent: document.getElementById('formNoteContent'),
  formNoteTags: document.getElementById('formNoteTags'),
  formNotePinned: document.getElementById('formNotePinned'),
  movieFields: document.getElementById('movieFields'),
  movieGenre: document.getElementById('movieGenre'),
  movieYear: document.getElementById('movieYear'),
  moviePlatform: document.getElementById('moviePlatform'),
  movieStatus: document.getElementById('movieStatus'),
  movieRating: document.getElementById('movieRating'),
  movieDirector: document.getElementById('movieDirector'),
  starRatingPicker: document.getElementById('starRatingPicker'),
  studyFields: document.getElementById('studyFields'),
  studyFrequency: document.getElementById('studyFrequency'),
  studyTargetMinutes: document.getElementById('studyTargetMinutes'),
  checklistSection: document.getElementById('checklistSection'),
  checklistBuilder: document.getElementById('checklistBuilder'),
  newChecklistInput: document.getElementById('newChecklistInput'),
  addChecklistItemBtn: document.getElementById('addChecklistItemBtn'),

  // Category Modal Elements
  categoryModal: document.getElementById('categoryModal'),
  closeCatModalBtn: document.getElementById('closeCatModalBtn'),
  catManagerList: document.getElementById('catManagerList'),
  categoryForm: document.getElementById('categoryForm'),
  catFormHeader: document.getElementById('catFormHeader'),
  editCatId: document.getElementById('editCatId'),
  catNameInput: document.getElementById('catNameInput'),
  catIconInput: document.getElementById('catIconInput'),
  catColorInput: document.getElementById('catColorInput'),
  catDescInput: document.getElementById('catDescInput'),
  resetCatFormBtn: document.getElementById('resetCatFormBtn'),

  // Backup Modal Elements
  backupModal: document.getElementById('backupModal'),
  closeBackupModalBtn: document.getElementById('closeBackupModalBtn'),
  downloadBackupBtn: document.getElementById('downloadBackupBtn'),
  importFileInput: document.getElementById('importFileInput'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// Initialization
// ==========================================================================
async function init() {
  applyTheme(state.theme);
  setupEventListeners();
  await loadCategories();
  await loadStats();
  await loadNotes();
}

// ==========================================================================
// Theme Handling
// ==========================================================================
function applyTheme(theme) {
  state.theme = theme;
  document.body.className = `theme-${theme}`;
  localStorage.setItem('noteflow_theme', theme);
  if (theme === 'dark') {
    elements.themeIcon.textContent = '☀️';
    elements.themeLabel.textContent = 'Light Mode';
  } else {
    elements.themeIcon.textContent = '🌙';
    elements.themeLabel.textContent = 'Dark Mode';
  }
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// ==========================================================================
// Toast Notifications
// ==========================================================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <span>${escapeHtml(message)}</span>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ==========================================================================
// Data Fetching
// ==========================================================================
async function loadCategories() {
  try {
    state.categories = await API.getCategories();
    renderCategories();
    populateCategoryDropdown();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadStats() {
  try {
    state.stats = await API.getStats();
    renderStats();
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

async function loadNotes() {
  try {
    const filters = {
      search: state.searchQuery,
      sort_by: state.sortBy,
      priority: state.filterPriority
    };

    if (state.currentCategory !== null) {
      filters.category_id = state.currentCategory;
    }

    if (state.currentView === 'pinned') {
      filters.is_pinned = true;
    } else if (state.currentView === 'movie') {
      filters.note_type = 'movie';
    } else if (state.currentView === 'study') {
      filters.note_type = 'study';
    } else if (state.filterType !== 'all') {
      filters.note_type = state.filterType;
    }

    state.notes = await API.getNotes(filters);
    renderNotes();
  } catch (err) {
    showToast('Failed to load notes: ' + err.message, 'error');
  }
}

// ==========================================================================
// Rendering Functions
// ==========================================================================
function renderStats() {
  const s = state.stats;
  elements.badgeAllCount.textContent = s.totalNotes || 0;
  elements.badgePinnedCount.textContent = s.pinnedNotes || 0;
  elements.badgeMovieCount.textContent = s.movieNotes || 0;
  elements.badgeStudyCount.textContent = s.studyNotes || 0;

  elements.statCountNotes.textContent = s.totalNotes || 0;
  elements.statWatchedMovies.textContent = s.moviesWatched || 0;
  elements.statTotalMovies.textContent = s.movieNotes || 0;
  elements.statDoneTasks.textContent = s.completedTasks || 0;
  elements.statTotalTasks.textContent = s.totalTasks || 0;
}

function renderCategories() {
  elements.categoriesList.innerHTML = '';

  state.categories.forEach(cat => {
    const li = document.createElement('li');
    li.className = `nav-item ${state.currentCategory === cat.id ? 'active' : ''}`;
    li.dataset.categoryId = cat.id;

    li.innerHTML = `
      <span class="cat-color-dot" style="background-color: ${cat.color}"></span>
      <span class="nav-icon">${cat.icon || '📁'}</span>
      <span class="nav-label" title="${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</span>
      <span class="nav-badge">${cat.note_count || 0}</span>
    `;

    li.addEventListener('click', () => {
      selectCategory(cat.id);
    });

    elements.categoriesList.appendChild(li);
  });
}

function populateCategoryDropdown() {
  elements.formNoteCategory.innerHTML = '<option value="">(None / General)</option>';
  state.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.icon || '📁'} ${cat.name}`;
    elements.formNoteCategory.appendChild(opt);
  });
}

function selectCategory(catId) {
  state.currentCategory = catId;
  state.currentView = 'category';

  // Highlight active
  document.querySelectorAll('#quickViewsList .nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#categoriesList .nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.categoryId == catId);
  });

  const cat = state.categories.find(c => c.id == catId);
  if (cat) {
    elements.currentViewTitle.textContent = `${cat.icon || '📁'} ${cat.name}`;
    elements.currentViewSubtitle.textContent = cat.description || `Notes categorized under ${cat.name}`;
    elements.activeCategoryBanner.style.display = 'flex';
    elements.activeCategoryBanner.style.borderLeftColor = cat.color;
    elements.activeCatIcon.textContent = cat.icon || '📁';
    elements.activeCatTitle.textContent = cat.name;
    elements.activeCatDesc.textContent = cat.description || 'No description provided';
  }

  closeSidebarMobile();
  loadNotes();
}

function selectQuickView(viewName) {
  state.currentCategory = null;
  state.currentView = viewName;

  elements.activeCategoryBanner.style.display = 'none';
  document.querySelectorAll('#categoriesList .nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#quickViewsList .nav-item').forEach(el => {
    const isTarget = (viewName === 'all' && el.dataset.view === 'all') ||
                     (viewName === 'pinned' && el.dataset.view === 'pinned') ||
                     (viewName === 'movie' && el.dataset.type === 'movie') ||
                     (viewName === 'study' && el.dataset.type === 'study');
    el.classList.toggle('active', isTarget);
  });

  if (viewName === 'all') {
    elements.currentViewTitle.textContent = 'All Notes';
    elements.currentViewSubtitle.textContent = 'Showing all notes across categories';
    elements.filterType.value = 'all';
  } else if (viewName === 'pinned') {
    elements.currentViewTitle.textContent = '📌 Pinned Notes';
    elements.currentViewSubtitle.textContent = 'Quick access to your most important notes';
  } else if (viewName === 'movie') {
    elements.currentViewTitle.textContent = '🎬 Movie Watchlist';
    elements.currentViewSubtitle.textContent = 'Track movies to watch, ratings, and platforms';
    elements.filterType.value = 'movie';
  } else if (viewName === 'study') {
    elements.currentViewTitle.textContent = '📚 Daily Study Routines';
    elements.currentViewSubtitle.textContent = 'Daily habits, study plans, and actionable checklists';
    elements.filterType.value = 'study';
  }

  closeSidebarMobile();
  loadNotes();
}

function renderNotes() {
  elements.notesContainer.innerHTML = '';

  if (state.notes.length === 0) {
    elements.emptyState.style.display = 'block';
    return;
  }
  elements.emptyState.style.display = 'none';

  state.notes.forEach((note, index) => {
    const card = createNoteCardElement(note, index);
    elements.notesContainer.appendChild(card);
  });
}

function createNoteCardElement(note, index = 0) {
  const card = document.createElement('div');
  card.className = `note-card ${note.is_pinned ? 'pinned' : ''}`;
  card.dataset.id = note.id;
  card.style.animationDelay = `${Math.min(index * 0.04, 0.32)}s`;

  // Apple Ambient Tint Glow (replaces cheap flat background fills)
  const tintMap = {
    '#ffe4e6': 'rose',
    '#dbeafe': 'blue',
    '#fef3c7': 'amber',
    '#dcfce7': 'emerald',
    '#f3e8ff': 'purple'
  };

  if (note.color && tintMap[note.color]) {
    card.dataset.tint = tintMap[note.color];
  } else if (note.note_type === 'movie') {
    card.dataset.tint = 'rose';
  } else if (note.note_type === 'study') {
    card.dataset.tint = 'blue';
  } else if (note.color && note.color.startsWith('#') && note.color !== '#ffffff') {
    card.style.background = `radial-gradient(ellipse at 92% 8%, ${note.color}26 0%, transparent 65%), var(--glass-card)`;
  }

  // Priority Dot
  const priorityHtml = `<span class="priority-dot ${note.priority || 'medium'}" title="Priority: ${note.priority}"></span>`;

  // Category Badge (Apple Frosted Pill)
  let catBadgeHtml = '';
  if (note.category_name) {
    const catColor = note.category_color || 'var(--apple-blue)';
    catBadgeHtml = `
      <span class="cat-badge">
        <span class="cat-color-dot" style="background-color: ${catColor}; color: ${catColor};"></span>
        <span>${note.category_icon || '📁'}</span> ${escapeHtml(note.category_name)}
      </span>
    `;
  }

  // Type Pill
  let typePillText = '📝 Note';
  if (note.note_type === 'movie') typePillText = '🎬 Movie';
  if (note.note_type === 'study') typePillText = '📚 Study';

  // Specific Content Boxes
  let specializedContent = '';

  // 1. Movie Details
  if (note.note_type === 'movie') {
    const meta = note.metadata || {};
    const statusClass = meta.status || 'plan_to_watch';
    const statusLabels = {
      plan_to_watch: '⏳ Plan to Watch',
      watching: '🍿 Watching',
      watched: '✅ Watched',
      favorite: '⭐ Favorite'
    };

    const ratingStars = '★'.repeat(meta.rating || 5) + '☆'.repeat(5 - (meta.rating || 5));

    specializedContent = `
      <div class="movie-meta-box">
        <div class="movie-meta-row">
          <span class="movie-genre">${escapeHtml(meta.genre || 'Film / Series')}</span>
          ${meta.platform ? `<span class="movie-platform">📺 ${escapeHtml(meta.platform)}</span>` : ''}
        </div>
        <div class="movie-meta-row">
          <span class="movie-status-pill ${statusClass}" data-action="toggle-movie-status" title="Click to toggle watched status">
            ${statusLabels[statusClass] || 'Plan to Watch'}
          </span>
          <span class="star-rating-display" title="${meta.rating || 5} Stars">${ratingStars}</span>
        </div>
        ${meta.director ? `<div style="font-size: 0.75rem; color: var(--text-muted);">Director: ${escapeHtml(meta.director)} ${meta.year ? `(${meta.year})` : ''}</div>` : ''}
      </div>
    `;
  }

  // 2. Study Tracker Progress & Checklist
  let studyChecklistHtml = '';
  if (note.checklist_items && note.checklist_items.length > 0) {
    const totalItems = note.checklist_items.length;
    const completedItems = note.checklist_items.filter(item => item.completed).length;
    const percent = Math.round((completedItems / totalItems) * 100);

    let progressHeader = '';
    if (note.note_type === 'study') {
      const meta = note.metadata || {};
      progressHeader = `
        <div class="study-progress-container">
          <div class="study-progress-header">
            <span>${meta.frequency || 'Daily'} Progress: ${completedItems}/${totalItems} (${percent}%)</span>
            <button class="checklist-reset-btn" data-action="reset-checklist" title="Uncheck all items for today's routine">
              🔄 Reset for Today
            </button>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    }

    const itemsRows = note.checklist_items.map((item, idx) => `
      <label class="checklist-row ${item.completed ? 'done' : ''}">
        <input type="checkbox" data-index="${idx}" ${item.completed ? 'checked' : ''} data-action="toggle-check">
        <span class="checklist-text">${escapeHtml(item.text)}</span>
      </label>
    `).join('');

    studyChecklistHtml = `
      ${progressHeader}
      <div class="checklist-items-list">
        ${itemsRows}
      </div>
    `;
  }

  // Tags Chips
  let tagsHtml = '';
  if (note.tags && note.tags.length > 0) {
    tagsHtml = `
      <div class="card-tags">
        ${note.tags.map(t => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join('')}
      </div>
    `;
  }

  // Card Content
  const contentText = note.content ? escapeHtml(note.content) : '';

  card.innerHTML = `
    <div class="card-top">
      <div class="card-badges">
        ${priorityHtml}
        ${catBadgeHtml}
        <span class="type-pill">${typePillText}</span>
      </div>
      <div class="card-actions-quick">
        <button class="pin-btn ${note.is_pinned ? 'active' : ''}" data-action="pin" title="${note.is_pinned ? 'Unpin' : 'Pin to top'}">
          📌
        </button>
      </div>
    </div>

    <h3 class="card-title" data-action="edit">${escapeHtml(note.title)}</h3>

    ${specializedContent}

    ${studyChecklistHtml}

    ${contentText ? `<div class="card-content ${contentText.length > 200 ? 'collapsed' : ''}">${contentText}</div>` : ''}

    ${tagsHtml}

    <div class="card-footer">
      <span>${formatDate(note.updated_at || note.created_at)}</span>
      <div class="card-actions">
        <button class="action-icon-btn" data-action="duplicate" title="Duplicate Note">📋</button>
        <button class="action-icon-btn" data-action="edit" title="Edit Note">✏️</button>
        <button class="action-icon-btn delete-btn" data-action="delete" title="Delete Note">🗑️</button>
      </div>
    </div>
  `;

  // Card Event Listeners
  card.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    if (action === 'pin') {
      e.stopPropagation();
      try {
        await API.togglePin(note.id);
        await loadNotes();
        await loadStats();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else if (action === 'edit') {
      openNoteModal(note);
    } else if (action === 'delete') {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
        try {
          await API.deleteNote(note.id);
          showToast('Note deleted');
          await loadCategories();
          await loadStats();
          await loadNotes();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    } else if (action === 'duplicate') {
      e.stopPropagation();
      try {
        const copyData = {
          ...note,
          title: `${note.title} (Copy)`,
          is_pinned: 0
        };
        delete copyData.id;
        delete copyData.created_at;
        delete copyData.updated_at;
        delete copyData.category_name;
        delete copyData.category_icon;
        delete copyData.category_color;
        await API.createNote(copyData);
        showToast('Note duplicated');
        await loadCategories();
        await loadStats();
        await loadNotes();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else if (action === 'toggle-check') {
      e.stopPropagation();
      const idx = Number(target.dataset.index);
      const isChecked = target.checked;
      try {
        await API.toggleChecklist(note.id, idx, isChecked);
        await loadStats();
        await loadNotes();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else if (action === 'reset-checklist') {
      e.stopPropagation();
      try {
        await API.resetChecklist(note.id);
        showToast('Checklist reset for today!');
        await loadStats();
        await loadNotes();
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else if (action === 'toggle-movie-status') {
      e.stopPropagation();
      try {
        const meta = { ...(note.metadata || {}) };
        meta.status = meta.status === 'watched' ? 'plan_to_watch' : 'watched';
        await API.updateNote(note.id, { metadata: meta });
        showToast(meta.status === 'watched' ? 'Marked as Watched! 🍿' : 'Marked as Plan to Watch ⏳');
        await loadStats();
        await loadNotes();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  });

  return card;
}

// ==========================================================================
// Note Modal (Create & Edit)
// ==========================================================================
function openNoteModal(noteToEdit = null) {
  elements.noteForm.reset();
  state.checklistBuilderItems = [];
  elements.checklistBuilder.innerHTML = '';

  if (noteToEdit) {
    state.editingNoteId = noteToEdit.id;
    elements.noteModalTitle.textContent = 'Edit Note';
    elements.noteId.value = noteToEdit.id;
    elements.formNoteTitle.value = noteToEdit.title;
    elements.formNoteCategory.value = noteToEdit.category_id || '';
    elements.formNotePriority.value = noteToEdit.priority || 'medium';
    elements.formNoteColor.value = noteToEdit.color || 'default';
    elements.formNoteContent.value = noteToEdit.content || '';
    elements.formNoteTags.value = Array.isArray(noteToEdit.tags) ? noteToEdit.tags.join(', ') : '';
    elements.formNotePinned.checked = Boolean(noteToEdit.is_pinned);

    setModalNoteType(noteToEdit.note_type || 'general');

    // Load movie fields
    if (noteToEdit.note_type === 'movie') {
      const meta = noteToEdit.metadata || {};
      elements.movieGenre.value = meta.genre || '';
      elements.movieYear.value = meta.year || '';
      elements.moviePlatform.value = meta.platform || '';
      elements.movieStatus.value = meta.status || 'plan_to_watch';
      elements.movieDirector.value = meta.director || '';
      setStarRating(meta.rating || 5);
    }

    // Load study fields
    if (noteToEdit.note_type === 'study') {
      const meta = noteToEdit.metadata || {};
      elements.studyFrequency.value = meta.frequency || 'Daily';
      elements.studyTargetMinutes.value = meta.targetMinutes || '';
    }

    // Load checklist items
    if (Array.isArray(noteToEdit.checklist_items)) {
      state.checklistBuilderItems = [...noteToEdit.checklist_items];
      renderChecklistBuilder();
    }
  } else {
    // New Note default
    state.editingNoteId = null;
    elements.noteModalTitle.textContent = 'Create New Note';
    elements.noteId.value = '';
    elements.formNoteCategory.value = state.currentCategory || '';
    setStarRating(5);

    // Auto-select note type based on current view
    if (state.currentView === 'movie') {
      setModalNoteType('movie');
    } else if (state.currentView === 'study') {
      setModalNoteType('study');
    } else {
      setModalNoteType('general');
    }
  }

  elements.noteModal.style.display = 'flex';
  setTimeout(() => elements.formNoteTitle.focus(), 50);
}

function closeNoteModal() {
  elements.noteModal.style.display = 'none';
  elements.noteForm.reset();
  state.editingNoteId = null;
}

function setModalNoteType(type) {
  state.activeNoteType = type;

  // Toggle tab buttons
  document.querySelectorAll('.type-selector-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  // Toggle specific field containers
  elements.movieFields.style.display = type === 'movie' ? 'block' : 'none';
  elements.studyFields.style.display = type === 'study' ? 'block' : 'none';

  // For study, prompt with checklist
  if (type === 'study' && state.checklistBuilderItems.length === 0) {
    state.checklistBuilderItems = [
      { id: '1', text: 'Daily task 1', completed: false }
    ];
    renderChecklistBuilder();
  }
}

function setStarRating(rating) {
  elements.movieRating.value = rating;
  const stars = elements.starRatingPicker.querySelectorAll('.star-btn');
  stars.forEach(star => {
    const val = Number(star.dataset.value);
    star.classList.toggle('active', val <= rating);
  });
}

function renderChecklistBuilder() {
  elements.checklistBuilder.innerHTML = '';
  state.checklistBuilderItems.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'builder-item-row';
    row.innerHTML = `
      <input type="text" value="${escapeHtml(item.text)}" data-index="${index}">
      <button type="button" class="builder-del-btn" data-index="${index}" title="Remove task">✕</button>
    `;

    row.querySelector('input').addEventListener('input', (e) => {
      state.checklistBuilderItems[index].text = e.target.value;
    });

    row.querySelector('.builder-del-btn').addEventListener('click', () => {
      state.checklistBuilderItems.splice(index, 1);
      renderChecklistBuilder();
    });

    elements.checklistBuilder.appendChild(row);
  });
}

function addChecklistItemFromInput() {
  const text = elements.newChecklistInput.value.trim();
  if (!text) return;
  state.checklistBuilderItems.push({
    id: Date.now().toString(),
    text: text,
    completed: false
  });
  elements.newChecklistInput.value = '';
  renderChecklistBuilder();
  elements.newChecklistInput.focus();
}

// Handle Note Form Submit
elements.noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = elements.formNoteTitle.value.trim();
  if (!title) {
    showToast('Please enter a note title', 'error');
    return;
  }

  // Tags parsing
  const tags = elements.formNoteTags.value
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);

  // Filter checklist items
  const validChecklist = state.checklistBuilderItems
    .filter(item => item.text && item.text.trim())
    .map(item => ({
      id: item.id || Date.now().toString(),
      text: item.text.trim(),
      completed: Boolean(item.completed)
    }));

  const noteData = {
    title,
    content: elements.formNoteContent.value,
    category_id: elements.formNoteCategory.value || null,
    note_type: state.activeNoteType,
    priority: elements.formNotePriority.value,
    color: elements.formNoteColor.value,
    is_pinned: elements.formNotePinned.checked ? 1 : 0,
    tags,
    checklist_items: validChecklist
  };

  // Build metadata
  if (state.activeNoteType === 'movie') {
    noteData.metadata = {
      genre: elements.movieGenre.value.trim(),
      year: elements.movieYear.value ? Number(elements.movieYear.value) : null,
      platform: elements.moviePlatform.value.trim(),
      status: elements.movieStatus.value,
      rating: Number(elements.movieRating.value || 5),
      director: elements.movieDirector.value.trim()
    };
  } else if (state.activeNoteType === 'study') {
    noteData.metadata = {
      frequency: elements.studyFrequency.value,
      targetMinutes: elements.studyTargetMinutes.value ? Number(elements.studyTargetMinutes.value) : null
    };
  } else {
    noteData.metadata = {};
  }

  try {
    if (state.editingNoteId) {
      await API.updateNote(state.editingNoteId, noteData);
      showToast('Note updated successfully! ✨');
    } else {
      await API.createNote(noteData);
      showToast('Note created successfully! 🚀');
    }

    closeNoteModal();
    await loadCategories();
    await loadStats();
    await loadNotes();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Formatting Toolbar Handler
document.querySelectorAll('.toolbar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const format = btn.dataset.format;
    const textarea = elements.formNoteContent;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = '';
    if (format === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (format === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (format === 'bullet') replacement = `\n- ${selected || 'item'}`;
    else if (format === 'code') replacement = `\`\`\`\n${selected || '// code'}\n\`\`\``;
    else if (format === 'quote') replacement = `\n> ${selected || 'quote'}`;

    textarea.value = text.substring(0, start) + replacement + text.substring(end);
    textarea.focus();
  });
});

// ==========================================================================
// Category Management Modal
// ==========================================================================
function openCategoryModal() {
  renderCategoryManagerList();
  resetCatForm();
  elements.categoryModal.style.display = 'flex';
}

function closeCategoryModal() {
  elements.categoryModal.style.display = 'none';
  resetCatForm();
}

function renderCategoryManagerList() {
  elements.catManagerList.innerHTML = '';
  state.categories.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'cat-manage-item';
    item.innerHTML = `
      <div class="cat-manage-info">
        <span style="font-size: 1.25rem;">${cat.icon || '📁'}</span>
        <span class="cat-color-dot" style="background-color: ${cat.color}"></span>
        <strong>${escapeHtml(cat.name)}</strong>
        <span class="help-text">(${cat.note_count || 0} notes)</span>
      </div>
      <div class="cat-manage-actions">
        <button class="action-icon-btn edit-cat-btn" title="Edit Category">✏️</button>
        <button class="action-icon-btn delete-btn del-cat-btn" title="Delete Category">🗑️</button>
      </div>
    `;

    item.querySelector('.edit-cat-btn').addEventListener('click', () => {
      elements.catFormHeader.textContent = 'Edit Category';
      elements.editCatId.value = cat.id;
      elements.catNameInput.value = cat.name;
      elements.catIconInput.value = cat.icon || '📁';
      elements.catColorInput.value = cat.color || '#6366f1';
      elements.catDescInput.value = cat.description || '';
      elements.resetCatFormBtn.style.display = 'inline-block';
      elements.catNameInput.focus();
    });

    item.querySelector('.del-cat-btn').addEventListener('click', async () => {
      if (confirm(`Delete category "${cat.name}"? Notes inside will remain uncategorized.`)) {
        try {
          await API.deleteCategory(cat.id);
          showToast('Category deleted');
          if (state.currentCategory === cat.id) {
            selectQuickView('all');
          }
          await loadCategories();
          await loadNotes();
          renderCategoryManagerList();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });

    elements.catManagerList.appendChild(item);
  });
}

function resetCatForm() {
  elements.catFormHeader.textContent = 'Add New Category';
  elements.editCatId.value = '';
  elements.catNameInput.value = '';
  elements.catIconInput.value = '📁';
  elements.catColorInput.value = '#6366f1';
  elements.catDescInput.value = '';
  elements.resetCatFormBtn.style.display = 'none';
}

elements.categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = elements.catNameInput.value.trim();
  if (!name) return;

  const data = {
    name,
    icon: elements.catIconInput.value.trim() || '📁',
    color: elements.catColorInput.value,
    description: elements.catDescInput.value.trim()
  };

  try {
    const editId = elements.editCatId.value;
    if (editId) {
      await API.updateCategory(editId, data);
      showToast('Category updated');
    } else {
      await API.createCategory(data);
      showToast('Category created! 🎉');
    }
    resetCatForm();
    await loadCategories();
    await loadNotes();
    renderCategoryManagerList();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Category Presets Event Listeners
document.querySelectorAll('.preset-emoji').forEach(el => {
  el.addEventListener('click', () => {
    elements.catIconInput.value = el.dataset.emoji;
  });
});

document.querySelectorAll('.preset-color').forEach(el => {
  el.addEventListener('click', () => {
    elements.catColorInput.value = el.dataset.color;
  });
});

// ==========================================================================
// Backup & Restore
// ==========================================================================
elements.downloadBackupBtn.addEventListener('click', async () => {
  try {
    const data = await API.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noteflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully!');
  } catch (err) {
    showToast(err.message, 'error');
  }
});

elements.importFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!confirm('Restoring will replace all current notes and categories. Continue?')) {
      elements.importFileInput.value = '';
      return;
    }
    const res = await API.importData(data);
    showToast(`Restored ${res.notesCount} notes across ${res.categoriesCount} categories!`);
    elements.backupModal.style.display = 'none';
    elements.importFileInput.value = '';
    await loadCategories();
    await loadStats();
    await loadNotes();
  } catch (err) {
    showToast('Failed to import backup: ' + err.message, 'error');
  }
});

// ==========================================================================
// Event Listeners & Hotkeys
// ==========================================================================
function setupEventListeners() {
  // Mobile Sidebar
  elements.mobileMenuBtn.addEventListener('click', () => elements.sidebar.classList.add('open'));
  elements.sidebarCloseBtn.addEventListener('click', () => elements.sidebar.classList.remove('open'));

  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // New Note Triggers
  elements.newNoteBtn.addEventListener('click', () => openNoteModal());
  elements.headerNewNoteBtn.addEventListener('click', () => openNoteModal());
  elements.emptyStateNewNoteBtn.addEventListener('click', () => openNoteModal());

  // Close Note Modal
  elements.closeNoteModalBtn.addEventListener('click', closeNoteModal);
  elements.cancelNoteModalBtn.addEventListener('click', closeNoteModal);

  // Tab switching in Note Modal
  document.querySelectorAll('.type-selector-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setModalNoteType(btn.dataset.type));
  });

  // Star Rating Picker
  elements.starRatingPicker.querySelectorAll('.star-btn').forEach(star => {
    star.addEventListener('click', () => setStarRating(Number(star.dataset.value)));
  });

  // Checklist builder add button & enter key
  elements.addChecklistItemBtn.addEventListener('click', addChecklistItemFromInput);
  elements.newChecklistInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChecklistItemFromInput();
    }
  });

  // Category Management Modal
  elements.manageCategoriesBtn.addEventListener('click', openCategoryModal);
  elements.addCategoryBtn.addEventListener('click', openCategoryModal);
  elements.closeCatModalBtn.addEventListener('click', closeCategoryModal);
  elements.resetCatFormBtn.addEventListener('click', resetCatForm);
  elements.activeCatEditBtn.addEventListener('click', () => {
    openCategoryModal();
    const cat = state.categories.find(c => c.id === state.currentCategory);
    if (cat) {
      elements.catFormHeader.textContent = 'Edit Category';
      elements.editCatId.value = cat.id;
      elements.catNameInput.value = cat.name;
      elements.catIconInput.value = cat.icon || '📁';
      elements.catColorInput.value = cat.color || '#6366f1';
      elements.catDescInput.value = cat.description || '';
      elements.resetCatFormBtn.style.display = 'inline-block';
    }
  });
  elements.activeCatClearBtn.addEventListener('click', () => selectQuickView('all'));

  // Backup Modal
  elements.backupModalBtn.addEventListener('click', () => elements.backupModal.style.display = 'flex');
  elements.closeBackupModalBtn.addEventListener('click', () => elements.backupModal.style.display = 'none');

  // Quick Views navigation
  document.querySelectorAll('#quickViewsList .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.view) selectQuickView(item.dataset.view);
      else if (item.dataset.type) selectQuickView(item.dataset.type);
    });
  });

  // Search input live filtering
  let debounceTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    state.searchQuery = e.target.value;
    elements.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
    debounceTimeout = setTimeout(loadNotes, 200);
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.searchQuery = '';
    elements.searchClearBtn.style.display = 'none';
    loadNotes();
  });

  // Filters
  elements.filterType.addEventListener('change', (e) => {
    state.filterType = e.target.value;
    loadNotes();
  });

  elements.filterPriority.addEventListener('change', (e) => {
    state.filterPriority = e.target.value;
    loadNotes();
  });

  elements.sortBy.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    loadNotes();
  });

  // View mode toggle (Grid vs List)
  elements.gridViewBtn.addEventListener('click', () => {
    state.viewMode = 'grid';
    elements.gridViewBtn.classList.add('active');
    elements.listViewBtn.classList.remove('active');
    elements.notesContainer.className = 'notes-container grid-view';
  });

  elements.listViewBtn.addEventListener('click', () => {
    state.viewMode = 'list';
    elements.listViewBtn.classList.add('active');
    elements.gridViewBtn.classList.remove('active');
    elements.notesContainer.className = 'notes-container list-view';
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Escape closes modals
    if (e.key === 'Escape') {
      closeNoteModal();
      closeCategoryModal();
      elements.backupModal.style.display = 'none';
      elements.sidebar.classList.remove('open');
    }

    // Cmd/Ctrl + K or / to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      elements.searchInput.focus();
    }

    // Cmd/Ctrl + N to open new note modal (when not inside an input)
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openNoteModal();
      }
    }
  });

  // Backdrop clicks close modals
  [elements.noteModal, elements.categoryModal, elements.backupModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
}

function closeSidebarMobile() {
  if (window.innerWidth <= 900) {
    elements.sidebar.classList.remove('open');
  }
}

// ==========================================================================
// Utilities
// ==========================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

// Start application
init();

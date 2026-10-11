// API Client for NoteFlow
const API = {
  async getCategories() {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    return data.categories;
  },

  async createCategory(catData) {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data.category;
  },

  async updateCategory(id, catData) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data.category;
  },

  async deleteCategory(id) {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data.success;
  },

  async getNotes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category_id !== undefined && filters.category_id !== null) params.set('category_id', filters.category_id);
    if (filters.search) params.set('search', filters.search);
    if (filters.note_type && filters.note_type !== 'all') params.set('note_type', filters.note_type);
    if (filters.priority && filters.priority !== 'all') params.set('priority', filters.priority);
    if (filters.is_pinned !== undefined) params.set('is_pinned', filters.is_pinned ? '1' : '0');
    if (filters.sort_by) params.set('sort_by', filters.sort_by);

    const res = await fetch(`/api/notes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    const data = await res.json();
    return data.notes;
  },

  async getNote(id) {
    const res = await fetch(`/api/notes/${id}`);
    if (!res.ok) throw new Error('Failed to load note');
    const data = await res.json();
    return data.note;
  },

  async createNote(noteData) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create note');
    return data.note;
  },

  async updateNote(id, noteData) {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update note');
    return data.note;
  },

  async deleteNote(id) {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete note');
    return data.success;
  },

  async togglePin(id) {
    const res = await fetch(`/api/notes/${id}/pin`, { method: 'PATCH' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle pin');
    return data.note;
  },

  async toggleChecklist(id, itemIndex, completed) {
    const res = await fetch(`/api/notes/${id}/checklist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemIndex, completed })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle item');
    return data.note;
  },

  async resetChecklist(id) {
    const res = await fetch(`/api/notes/${id}/checklist/reset`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset checklist');
    return data.note;
  },

  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return data.stats;
  },

  async exportData() {
    const res = await fetch('/api/export');
    if (!res.ok) throw new Error('Failed to export backup');
    return res.json();
  },

  async importData(data) {
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to import data');
    return resData;
  }
};

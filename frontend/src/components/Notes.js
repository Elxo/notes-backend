import React, { useState, useEffect, useMemo } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../services/api';
import './Notes.css';

export default function Notes() {
  const [notes, setNotes]         = useState([]);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo]     = useState('');

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateNote(editingId, title, content);
    } else {
      await createNote(title, content);
    }
    setEditingId(null);
    setTitle('');
    setContent('');
    setNotes(await getNotes());
  };

  const handleEdit = note => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this note?')) return;
    await deleteNote(id);
    setNotes(await getNotes());
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const text = `${note.title} ${note.content}`.toLowerCase();
      if (searchTerm && !text.includes(searchTerm.toLowerCase())) return false;
      const updated = new Date(note.updatedAt);
      if (filterFrom && updated < new Date(filterFrom)) return false;
      if (filterTo   && updated > new Date(filterTo + 'T23:59:59')) return false;
      return true;
    });
  }, [notes, searchTerm, filterFrom, filterTo]);

  return (
    <div className="notes-layout">
      <aside className="notes-sidebar">
        <h3>Search & Filter</h3>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <label>
          From
          <input
            type="date"
            value={filterFrom}
            onChange={e => setFilterFrom(e.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={filterTo}
            onChange={e => setFilterTo(e.target.value)}
          />
        </label>
        <button
          className="clear-filters-btn"
          onClick={() => {
            setSearchTerm('');
            setFilterFrom('');
            setFilterTo('');
          }}
        >
          Clear Filters
        </button>
      </aside>

      <section className="notes-main">
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="note-form-actions">
            <button type="submit">
              {editingId ? 'Update Note' : 'Add Note'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>

        <ul className="notes-list">
          {filteredNotes.map(n => (
            <li key={n._id}>
              <div>
                <strong>{n.title}</strong>
                <p>{n.content}</p>
                <small>
                  Last updated: {new Date(n.updatedAt).toLocaleString()}
                </small>
              </div>
              <div className="note-actions">
                <button onClick={() => handleEdit(n)}>Edit</button>
                <button onClick={() => handleDelete(n._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
);
}

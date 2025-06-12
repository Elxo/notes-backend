const express = require('express');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

const router = express.Router();

// GET all notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort('-updatedAt');
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create note
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ msg: 'Title is required' });
  try {
    const note = new Note({ user: req.user, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET one note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update note
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ msg: 'Note not found' });

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

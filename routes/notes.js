const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');

//1st endpoint- Fetch all notes using GET: "/api/auth/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);

});

//2nd endpoint- Add a note using POST: "/api/auth/createnote"
router.get('/createnote', fetchuser, async (req, res) => {
const notes = await Notes.create({
    title: req.body.title,
    description: req.body.description,
    tag: req.body.tag
});
res.json({notes});

});

module.exports = router
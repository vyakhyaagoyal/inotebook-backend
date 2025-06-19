const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { query, body, validationResult } = require('express-validator');
const User = require('../models/User');

//1st endpoint- Fetch all notes of a particular user using GET: "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const fetch = await Notes.find({ user: req.user.id });
        if (!fetch) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(fetch);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error occurred");
    }

});

//2nd endpoint- Create a note using POST: "/api/notes/createnote"
router.post('/createnote',
    [body('title', 'Title must be atleast 2 characters').isLength({ min: 2 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 })]
    , fetchuser, async (req, res) => {
        //check for errors
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }
        try {
            //alternate way below
            // const{title,description,tag}=req.body; //destructuring
            // const notes=new note ({
            //     title, description,tag,user:req.user.id
            // })
            // const savedNote=await Notes.save();
            // res.json({ savedNote });

            const create = await Notes.create({
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag,
                user: req.user.id // associate note with the logged-in user
            });
            // console.log(create)
            res.json(create);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Error occurred");
        }

    });

//3rd endpoint- Update a note using PUT: "/api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Find the note to update, ensuring it belongs to the user
        let update = await Notes.findOne({ _id: req.params.id, user: req.user.id });
        if (!update) {
            return res.status(404).json({ error: "Note not found" });
        }

        //check if the user logged in is only the person updating the note(security)
        if (update.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }

        // Update fields if provided
        if (title) update.title = title;
        if (description) update.description = description;
        if (tag) update.tag = tag;

        // Save and return the updated note
        const updatedNote = await update.save();
        res.json(updatedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error occurred");
    }

});


//4th endpoint- Delete a note using DELETE: "/api/notes/deletenote/:id"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        //CHECK IF THE NOTE TO BE DELETED EXISTS OR NOT
        let check = await Notes.findById(req.params.id);
        if (!check) {
            return res.status(404).json({ error: "Note not found" });
        }

        // console.log(req.user.id);
        // console.log(check.user.toString());

        //Checks if the logged-in user owns the note(security)
        if (check.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }

        // check = await Notes.findByIdAndDelete(req.params.id);
        // res.json({ "Success": "Deleted the note" });
        const deleted = await check.deleteOne(); //alternate method
        res.json({ deleted });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error occurred");
    }
});

module.exports = router
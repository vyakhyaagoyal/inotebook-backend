const express = require('express');
const User = require('../models/User');
const router = express.Router();  //express router object
const { query,body, validationResult } = require('express-validator');

router.post('/', [body('email', 'enter a valid mail').isEmail(),
    body('name','length is less than 3').isLength({min:3})], (req, res) => {
    // res.send(req.body);
    // const user=new User(req.body);
    // user.save();

    const result = validationResult(req);
    if (result.isEmpty()) {
        return res.send(req.body); //send object directly or use JSON.stringify
    }

    res.send({ errors: result.array() });
});

module.exports = router
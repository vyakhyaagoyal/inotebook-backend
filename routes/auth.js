const express = require('express');
const User = require('../models/User');
const router = express.Router();  //express router object
const { query, body, validationResult } = require('express-validator');

//create a user using POST
router.post('/createuser', [body('email', 'enter a valid mail').isEmail(),
body('name', 'length is less than 3').isLength({ min: 3 }),
body('password', 'password must be atleast 5 characters').isLength({ min: 5 }),
body('password', 'enter valid password').isStrongPassword({ minLength: 5, })],
    // default settings of isStrongPassword()=> { minLength: 8, minLowercase: 1, minUppercase: 1, 
    // minNumbers: 1, minSymbols: 1, returnScore: false, 
    // pointsPerUnique: 1, pointsPerRepeat: 0.5, 
    // pointsForContainingLower: 10, pointsForContainingUpper: 10, 
    // pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    (req, res) => {
        // res.send(req.body);
        // const user=new User(req.body);
        // user.save();

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }

        User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }).then(user=>res.json({name: user.name, email: user.email, id: user._id }))
        .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));

        // res.send(req.body); //send object directly or use JSON.stringify
    });

module.exports = router
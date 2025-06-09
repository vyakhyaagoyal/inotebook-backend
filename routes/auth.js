const express = require('express');
const User = require('../models/User');
const router = express.Router();  //express router object
const { query, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const jwtSecret = process.env.JWT_SECRET;

//1st endpoint- Create a user using POST: "/api/auth/createuser"
router.post('/createuser', [body('name', 'length is less than 3').isLength({ min: 3 }),
body('email', 'enter a valid mail').isEmail(),
body('password', 'enter valid password').isStrongPassword({ minLength: 5, })],
    // default settings/parameters of isStrongPassword()=> { minLength: 8, minLowercase: 1, minUppercase: 1, 
    // minNumbers: 1, minSymbols: 1, returnScore: false, 
    // pointsPerUnique: 1, pointsPerRepeat: 0.5, 
    // pointsForContainingLower: 10, pointsForContainingUpper: 10, 
    // pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    async (req, res) => {
        // res.send(req.body);
        // const user=new User(req.body);
        // user.save();

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }

        try {
            //check if this email already exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "User with this email already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            //Create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })
            const payload = {
                user: {
                    id: user.id //using id bcz it is an index in mongodb compass
                }
            }

            var token = jwt.sign(payload, jwtSecret); //generating a token

            // res.json({ name: user.name, email: user.email, id: user._id })
            res.json({ token });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Error occurred");
        }

        // .then(user=>res.json({name: user.name, email: user.email, id: user._id }))
        // .catch(err => res.status(500).json({ error: 'Enter unique email', details: err }));

        // res.send(req.body); //send object directly or use JSON.stringify
    });


//2nd endpoint- Authenticate a user using POST: "/api/auth/login"
router.post('/login', [body('email', 'enter a valid mail').isEmail(),
body('password', 'password connot be blank').exists()],
    async (req, res) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ errors: result.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Login with correct credentials" });
            }

            const passCompare = await bcrypt.compare(password, user.password);
            if (!passCompare) {
                res.status(400).json({ error: "Enter valid password" });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }
            var token = jwt.sign(payload, jwtSecret);
            res.json({ token, id: user.id }); //send back the token to client

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Error occurred");
        }
    })


// 3rd endpoint- Get loggedin user details using POST: "/api/auth/getuser"- jwt token required for login
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error occurred");
    }

})

module.exports = router
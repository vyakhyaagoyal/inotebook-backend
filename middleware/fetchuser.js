const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    //get user id from jwt token and add id to req object

    const token = req.header('authtoken');
    if (!token) {
        res.status(401).send({ error: 'Authenticate using a valid token' });
    }

    try {
        var decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
    } catch (error) {
        res.status(401).send({ error: 'Authenticate using a valid token' });
    }
    
};

module.exports = fetchuser;
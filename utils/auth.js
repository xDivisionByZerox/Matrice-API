const jwt = require("jsonwebtoken");

// Create token from mail and hashed password
module.exports.generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};

// Verify if the token is cool
module.exports.authentificateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).send('Invalid token');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            res.status(401).send("Invalid token");
            next();
        }
        req.user = user;
        next();
    });
}
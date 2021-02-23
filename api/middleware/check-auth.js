const jwt = require('jsonwebtoken');
//Using middleware to protect certain routes by verifying a token before it is passed
module.exports = (req, res, next) => {
    try{
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        tnex();
    }
    catch(err){
    return res.status(401).json({
        message: 'Auth failed'
    });
}

};
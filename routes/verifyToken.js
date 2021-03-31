const jwt = require('jsonwebtoken');

//create a middleware function to protect any routhe that has to be private,
//without having a token, not possible to access it

//we create the function that looks in the request header auth token to see the token is valid
function auth(req, res, next) {
	const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access denied!')''
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    } catch (err) {
        res.status(400).send(`Invalid access : ${err}`)
    }
}

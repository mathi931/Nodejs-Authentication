const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, logInValidation } = require('../validation');
const bcrypt = require('bcryptjs');


//REGISTER
router.post('/register', async (req, res) => {
	//validate the data before
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//checking if the email aready exist
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(400).send('Email already exists');
	}

	//Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//create the new user after validation
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		//res.send({ user: user._id });
		res.send(savedUser);
	} catch (err) {
		res.status(400).send(err);
	}
});

//LOGIN
router.post('/login', async (req, res) => {
	//validate the data before
	const { error } = logInValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//checking if the email is registered already
	//and the password is correct
	const validUser = await User.findOne({ email: req.body.email });
	const validPass = await bcrypt.compare(req.body.password, validUser.password);

	if (!validUser || !validPass) {
		return res.status(400).send('This match doesnt exists');
	}

	//if both are OK assign a token and send a respond
    else if(validUser && validPass){
        const token = jwt.sign({ _id: validUser._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    }

});

//Get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;

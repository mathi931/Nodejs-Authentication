const router = require('express').Router();
const User = require('../model/User');
const { registerValidation } = require('../validation');
const bcrypt = require('bcryptjs');

//Register new user
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
		res.send({ user: user._id });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/login', (req, res) => {
	res.send('sucess login!');
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

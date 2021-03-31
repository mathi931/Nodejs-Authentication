const router = require('express').Router();
const User = require('../model/User');

//VALIDATION


//Register new user
router.post('/register', async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});
	try {
		const savedUser = await user.save();
		res.send(savedUser);
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

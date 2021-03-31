const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
{ useUnifiedTopology: true,
 useNewUrlParser: true 
});

//check test connection
mongoose.connection
	.once('open', () => {
		console.log('connected to the DB');
	})
	.on('error', (err) => {
		console.log(`connection error: ${err}`);
	});

//Middleware
app.use(express.json());


//Import Routes
const authRoute=  require('./routes/auth');


//Route Middlewares
app.use('/api/user', authRoute);


app.listen(3000);
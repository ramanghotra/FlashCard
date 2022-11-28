const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

// registering route
router.post("/register", validInfo, async (req, res) => {
	try {
		// destructure request body
		const { firstname, lastname, email, password } = req.body;

		// if user exists throw error
		const user = await pool.query(
			"SELECT * FROM users WHERE user_email = $1",
			[email]
		);

		if (user.rows.length !== 0) {
			return res.status(401).json("User already exists");
		}
		// brcrypt the user password
		const saltRound = 10;
		const salt = await bcrypt.genSalt(saltRound);
		const bcryptPassword = await bcrypt.hash(password, salt);

		// enter the new user inside our database
		const newUser = await pool.query(
			"INSERT INTO users (user_firstname, user_lastname, user_email, user_password) VALUES ($1, $2, $3, $4) RETURNING *",
			[firstname, lastname, email, bcryptPassword]
		);

		// generating our jwt token
		const token = jwtGenerator(newUser.rows[0].user_id);

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// login route
router.post("/login", validInfo, async (req, res) => {
	try {
		// destructure request body
		const { email, password } = req.body;

		// check fi user does not exist
		const user = await pool.query(
			"SELECT * FROM users WHERE user_email = $1",
			[email]
		);

		if (user.rows.length === 0) {
			return res.status(401).json("Password or Email is incorrect");
		}

		// check if incoming password is the same as the database password
		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].user_password
		);

		if (!validPassword) {
			return res.status(401).json("Password or Email is incorrect");
		}

		// give them the jwt token
		const token = jwtGenerator(user.rows[0].user_id);
		console.log("Token", token);

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// verify route
router.get("/verify", authorization, async (req, res) => {
	try {
		res.json(true);
		console.log(req.user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;

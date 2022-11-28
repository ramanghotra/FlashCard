const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all decks
router.get("/", authorization, async (req, res) => {
	try {
		// res.json(req.user);
		// Req.user has the uuid of the specific user. This can be used to get the user's information from the database.
		// authorization middleware will check if the token is valid
		// authorization also has the user's id
		const user = await pool.query(
			"SELECT user_firstname, user_lastname FROM users WHERE user_id = $1",
			[req.user]
		);

		const decks = await pool.query("SELECT * FROM decks");

		res.json({
			results: decks.rows.length,
			user: user.rows[0],
			decks: decks.rows,
		});
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});



// get a deck
router.get("/:id", authorization, async (req, res) => {
	try {
		// get user first name and email from users table and get all flashcards from flashcards table
		const user = await pool.query(
			"SELECT user_firstname, user_lastname FROM users WHERE user_id = $1",
			[req.user]
		);

		const deck = await pool.query(
			"SELECT * FROM decks WHERE deck_id = $1",
			[req.params.id]
		);

		const flashcards = await pool.query(
			"SELECT * FROM flashcards WHERE deck_id = $1",
			[req.params.id]
		);

		res.status(200).json({
			user: user.rows[0],
			deck: deck.rows,
			flashcards: flashcards.rows,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;

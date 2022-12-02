const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// create a deck
router.post("/", authorization, async (req, res) => {
	try {
		const { deckName, deckDescription, courseInfo } = req.body;
		console.log("create", req.body);
		const newDeck = await pool.query(
			"INSERT INTO decks (deck_name, deck_description, user_id, course_name) VALUES($1, $2, $3, $4) RETURNING *",
			[deckName, deckDescription, req.user, courseInfo]
		);

		const accuracyDeck = await pool.query(
			"INSERT INTO accuracy (deck_id, user_id) VALUES($1, $2) RETURNING *",
			[newDeck.rows[0].deck_id, req.user]
		);
		
		res.json(newDeck.rows[0]);

		console.log("newDeck", newDeck);
		console.log("newDeck.rows", newDeck.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).json("Server Error");
	}
});

// create a flashcard
router.post("/cards", authorization, async (req, res) => {
	console.log("create cards", req.body);
	try {
		const { question, answer, deck_id } = req.body;
		const newFlashcard = await pool.query(
			"INSERT INTO flashcards (question, answer, deck_id) VALUES($1, $2, $3) RETURNING *",
			[question, answer, deck_id]
		);
		res.json(newFlashcard.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json("Server Error");
	}
});

router.get("/", authorization, async (req, res) => {
	try {
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
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// get all decks
router.get("/", authorization, async (req, res) => {
	try {
		// get user first name and email from users table and get all flashcards from flashcards table
		const user = await pool.query(
			"SELECT user_firstname, user_lastname FROM users WHERE user_id = $1",
			[req.user]
		);

		const decks = await pool.query("SELECT * FROM decks");

		res.status(200).json({
			results: decks.rows.length,
			user: user.rows[0],
			decks: decks.rows,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;

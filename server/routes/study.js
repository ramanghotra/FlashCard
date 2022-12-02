const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all cards associated with a deck
router.get("/cards", authorization, async (req, res) => {
	try {
		const { id } = req.params;
		const cards = await pool.query(
			"SELECT * FROM flashcards WHERE deck_id = $1",
			[id]
		);
		res.json(cards.rows);
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// get a deck and its cards
router.get("/view/info/:id", authorization, async (req, res) => {
	console.log("req.params.id", req.params.id);
	try {
		const { id } = req.params;
		const deck = await pool.query(
			"SELECT * FROM decks WHERE deck_id = $1",
			[id]
		);
		const cards = await pool.query(
			"SELECT * FROM flashcards WHERE deck_id = $1",
			[id]
		);
		res.json({
			deck: deck.rows[0],
			cards: cards.rows,
		});
	} catch (err) {
		console.log("Error in edit.js", err.message);
		res.status(500).send("Server Error");
	}
});

// 

module.exports = router;
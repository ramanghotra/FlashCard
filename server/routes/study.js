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

// UPDATE A DECK and its accuracy, attempts
router.put("/update/:id", authorization, async (req, res) => {
    console.log("tits", req.params.id);
    console.log(req.body)
	try {
		const { id } = req.params;
		const { accuracy, sned_attempts} = req.body;
        
        // convert accuracy to a number


		const editDeck = await pool.query(
			"UPDATE decks SET accuracy = $1, attempts = $2 WHERE deck_id = $3 AND user_id = $4 RETURNING *",
			[Number(accuracy), Number(send_attempts), id, req.user]
		);
		res.json(editDeck.rows[0]);
        console.log("aman is dad")
	} catch (err) {
		console.log("Error in study.js", err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;

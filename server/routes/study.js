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
       

        // check if deck_id and user_id exist in accruacy table
        const accuracy = await pool.query(
            "SELECT * FROM accuracy WHERE deck_id = $1 AND user_id = $2",
            [id, req.user]
        );

        // if it does not exist, insert it
        if (accuracy.rows.length === 0) {
            const insertAccuracy = await pool.query(
                "INSERT INTO accuracy (deck_id, user_id, accuracy, attempts) VALUES ($1, $2, $3, $4) RETURNING *",
                [id, req.user, 0, 0]
            );
        } 
        
        // get the accuracy and attempts
        const getAccuracy = await pool.query(
            "SELECT * FROM accuracy WHERE deck_id = $1 AND user_id = $2",
            [id, req.user]
        );
            
		res.json({
			deck: deck.rows[0],
			cards: cards.rows,
            accuracy: getAccuracy.rows[0]
		});
	} catch (err) {
		console.log("Error in edit.js", err.message);
		res.status(500).send("Server Error");
	}
});

// UPDATE A DECK and its accuracy, attempts
router.put("/update/:id", authorization, async (req, res) => {
	console.log("tits", req.params.id);
	console.log(req.body);
	try {
		const { id } = req.params;
		const { send_accuracy, new_attempts } = req.body;

		// convert accuracy to a number

		const editDeck = await pool.query(
			"UPDATE accuracy SET accuracy = $1, attempts = $2 WHERE deck_id = $3 AND user_id = $4 ",
			[Number(send_accuracy), Number(new_attempts), id, req.user]
		);
		res.json(editDeck.rows[0]);
		console.log("aman is dad");
	} catch (err) {
		console.log("Error in study.js", err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;

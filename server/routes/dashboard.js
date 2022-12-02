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

		const message = await pool.query(
			"SELECT message FROM banner ORDER BY messageid DESC LIMIT 1"
		);

		// get favourites for the user
		const favourites = await pool.query(
			"SELECT * FROM favourites WHERE user_id = $1",
			[req.user]
		);

		// add a boolean to each deck to indicate if it is a favourite or not
		let decksWithFavourites = decks.rows.map((deck) => {
			const favourite = favourites.rows.find(
				(favourite) => favourite.deck_id === deck.deck_id
			);
			return {
				...deck,
				favourite: favourite ? true : false,
			};
		});

		newdecks = decksWithFavourites;
		res.json({
			results: decks.rows.length,
			user: user.rows[0],
			decks: newdecks,
			message: message.rows[0],
		});
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// add a deck to favourites table in database
router.post("/favourites", authorization, async (req, res) => {
	try {
		const { deck_id } = req.body;
		console.log(req.body);
		const newFavourite = await pool.query(
			"INSERT INTO favourites (user_id, deck_id) VALUES($1, $2) RETURNING *",
			[req.user, deck_id]
		);
		res.json(newFavourite.rows[0]);
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// remove a deck from favourites table using deck_id and user_id
router.delete("/favourites", authorization, async (req, res) => {
	try {
		const { deck_id } = req.body;
		const deleteFavourite = await pool.query(
			"DELETE FROM favourites WHERE user_id = $1 AND deck_id = $2",
			[req.user, deck_id]
		);
		res.json("Favourite was deleted!");
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

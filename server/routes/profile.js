const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all decks that belong to the user
router.get("/", authorization, async (req, res) => {
	try {
		// res.json(req.user);
		// Req.user has the uuid of the specific user. This can be used to get the user's information from the database.
		// authorization middleware will check if the token is valid
		// authorization also has the user's id
		const user = await pool.query(
			"SELECT user_firstname, user_lastname, user_role FROM users WHERE user_id = $1",
			[req.user]
		);

		const decks = await pool.query(
			"SELECT * FROM decks WHERE user_id = $1",
			[req.user]
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
		});
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// set message in banner table
router.post("/admin/banner", authorization, async (req, res) => {
	try {
		const { message } = req.body;
		const newMessage = await pool.query(
			"INSERT INTO banner (message) VALUES($1) RETURNING *",
			[message]
		);
		res.json(newMessage.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json("Server Error");
	}
});

// get a deck and its cards
router.get("/edit/:id", authorization, async (req, res) => {
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

// edit a deck
router.put("/edit", authorization, async (req, res) => {
	try {
		const { deck_id, deck_name, deck_description } = req.body;
		const editDeck = await pool.query(
			"UPDATE decks SET deck_name = $1, deck_description = $2 WHERE deck_id = $3 AND user_id = $4 RETURNING *",
			[deck_name, deck_description, deck_id, req.user]
		);
		res.json(editDeck.rows[0]);
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// delete a deck
router.delete("/delete/deck", authorization, async (req, res) => {
	console.log("deleting///");
	try {
		const { deck_id } = req.body;

		console.log(deck_id);
		console.log(req.user);

		// delete all cards in the deck
		const deleteCards = await pool.query(
			"DELETE FROM flashcards WHERE deck_id = $1",
			[deck_id]
		);

		// delete from accuracy table
		const deleteAccuracy = await pool.query(
			"DELETE FROM accuracy WHERE deck_id = $1",
			[deck_id]
		);

		console.log("cards deleted");
		// delete all favourites in the deck
		const deleteFavourites = await pool.query(
			"DELETE FROM favourites WHERE deck_id = $1",
			[deck_id]
		);
		console.log("favourites deleted");

		const deleteDeck = await pool.query(
			"DELETE FROM decks WHERE deck_id = $1 RETURNING *",
			[deck_id]
		);
		console.log("deck deleted");

		res.json(deleteDeck.rows);

		console.log("deleted");
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// delete a card as admin
router.delete("/admin/delete/deck", authorization, async (req, res) => {
	try {
		const { deck_id } = req.body;

		console.log(deck_id);
		console.log(req.user);

		// delete all cards in the deck
		const deleteCards = await pool.query(
			"DELETE FROM flashcards WHERE deck_id = $1",
			[deck_id]
		);

		const deleteAccuracy = await pool.query(
			"DELETE FROM accuracy WHERE deck_id = $1",
			[deck_id]
		);

		// delete all favourites in the deck
		const deleteFavourites = await pool.query(
			"DELETE FROM favourites WHERE deck_id = $1",
			[deck_id]
		);

		const deleteDeck = await pool.query(
			"DELETE FROM decks WHERE deck_id = $1 RETURNING *",
			[deck_id]
		);

		res.json(deleteDeck.rows);

		console.log("deleted");
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// delete a user
router.delete("/delete/user", authorization, async (req, res) => {
	console.log("deleting///");
	try {
		const { user_id } = req.body;
		console.log(user_id);

		// delete all decks associated with user
		const deleteDecks = await pool.query(
			"DELETE FROM decks WHERE user_id = $1",
			[user_id]
		);

		// delete all favourites associated with user
		const deleteFavourites = await pool.query(
			"DELETE FROM favourites WHERE user_id = $1",
			[user_id]
		);

		// delete the user
		const deleteUser = await pool.query(
			"DELETE FROM users WHERE user_id = $1 RETURNING *",
			[user_id]
		);

		res.json(deleteUser.rows, deleteDecks.rows, deleteFavourites.rows);

		console.log(
			deleteDecks.rows,
			"decks deleted",
			deleteFavourites.rows,
			"favourites deleted",
			deleteUser.rows,
			"user deleted"
		);

		console.log("deleted");
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// edit a card
router.put("/edit/card", authorization, async (req, res) => {
	console.log(req.body);
	try {
		console.log(123123);
		const { flashcard_id, updatedQuestion, updatedAnswer } = req.body;
		const editCard = await pool.query(
			"UPDATE flashcards SET question = $1, answer = $2 WHERE flashcard_id = $3 RETURNING *",
			[updatedQuestion, updatedAnswer, flashcard_id]
		);
		res.json(editCard.rows[0]);
		console.log(editCard.rows[0]);
		console.log("SUCCESSSSS");
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// delete a card
router.delete("/delete/card", authorization, async (req, res) => {
	try {
		const { card_id } = req.body;
		const deleteCard = await pool.query(
			"DELETE FROM flashcards WHERE flashcard_id = $1 RETURNING *",
			[card_id]
		);
		res.json(deleteCard.rows[0]);
	} catch (err) {
		console.log("Error in dashboard.js", err.message);
		res.status(500).send("Server Error");
	}
});

// get all decks and users
router.get("/admin", authorization, async (req, res) => {
	try {
		const users = await pool.query("SELECT * FROM users");
		const decks = await pool.query("SELECT * FROM decks");

		// add user name to each deck by using the user id
		let decksWithUsers = decks.rows.map((deck) => {
			const user = users.rows.find(
				(user) => user.user_id === deck.user_id
			);
			return {
				...deck,
				user: user.user_firstname + " " + user.user_lastname,
			};
		});

		res.json({
			users: users.rows,
			decks: decksWithUsers,
		});
	} catch (err) {
		console.log("Error in admin.js", err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;

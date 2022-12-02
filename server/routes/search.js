const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// get all decks that have word in the title
router.get("/decks/:id", authorization, async (req, res) => {
    console.log("req.params.id", req.params);
    try {
        const  word  = req.params.id;
        console.log("word", word);
        const decks = await pool.query(
            "SELECT * FROM decks WHERE deck_name ILIKE $1",
            [`%${word}%`]
        );
        res.json(decks.rows);

        console.log("decks.rows", decks.rows);
    } catch (err) {
        console.log("Error in dashboard.js", err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
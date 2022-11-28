const db = require("./db");
const express = require("express");
const cors = require("cors");
const port = 3001;

const app = express();

// middleware
app.use(express.json()); // req.body
app.use(cors());

// Routes

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

// create route
app.use("/create", require("./routes/create"));

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

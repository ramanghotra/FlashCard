const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	try {
		// get token from header
		const jwtToken = req.header("token");

		// if no token
		if (!jwtToken) {
			return res.status(403).json("Not Authorized");
		}

		// verify token
		const payload = jwt.verify(jwtToken, process.env.jwtSecret);

		req.user = payload.user;
		next();
	} catch (err) {
		console.error(err.message);
		return res.status(403).json("Not Authorized");
		// res.status(403).send("Not Authorized");
	}
};

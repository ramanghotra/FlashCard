module.exports = (req, res, next) => {
	const { firstname, lastname, email, password } = req.body;

	// email validation
	function validEmail(userEmail) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
	}
	
	if (req.path === "/register") {
		if (![firstname, lastname, email, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials 1");
		} else if (!validEmail(email)) {
			return res.status(401).json("Invalid Email");
		}
	} else if (req.path === "/login") {
		if (![email, password].every(Boolean)) {
			return res.status(401).json("Missing Credentials 2");
		} else if (!validEmail(email)) {
			return res.status(401).json("Invalid Email");
		}
	}

	next();
};



import React, { Fragment, useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

import Deck from "./Deck";
const Dashboard = ({ setAuth }) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);
	console.log("Dashboard.js");
	async function fetchData() {
		try {
			const response = await fetch("http://localhost:3001/dashboard/", {
				method: "GET",
				headers: { token: localStorage.token },
			});
			const parseRes = await response.json();
			setDecks(parseRes.decks);
			setName(parseRes.user);
			console.log("ParseRes", parseRes);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				navigate("/login");
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1 className="text-center">Dashboard</h1>
				<h2>Hello, {name.user_firstname}</h2>
			</div>
			<div>
				{decks.length > 0 ? (
					<Deck decks={decks} />
				) : (
					console.log("no decks")
				)}
			</div>
		</div>
	);
};

export default Dashboard;

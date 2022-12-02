import React, { useState, useEffect } from "react";
import Admin from "./Admin";
import ProfileDeck from "./ProfileDeck";

const Profile = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);

	async function fetchData() {
		try {
			const response = await fetch("http://localhost:3001/profile", {
				method: "GET",
				headers: { token: localStorage.token },
			});

			const parseRes = await response.json();
			setDecks(parseRes.decks);
			setName(parseRes.user);
            console.log(name)
			console.log("ParseRes", parseRes);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				window.location = "/";
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1>{name.user_firstname}'s Profile</h1>
			</div>
			<div>
				{decks.length > 0 ? (
					<ProfileDeck decks={decks} />
				) : (
					<h1>No decks</h1>
				)}
			</div>
			{/* Display admin console if user.role is admin */}
			{name.user_role === "admin" ? (
				<div>
					<Admin />
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
};

export default Profile;

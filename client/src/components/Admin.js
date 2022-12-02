import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();

	const updateDecks = (deck_id) => {
		setDecks((prevDecks) => {
			return prevDecks.filter((deck) => deck.deck_id !== deck_id);
		});
	};

	const updateUsers = (user_id) => {
		setUsers((prevUsers) => {
			return prevUsers.filter((user) => user.user_id !== user_id);
		});
	};

	async function fetchData() {
		console.log("fetchData");
		try {
			const response = await fetch(
				"http://localhost:3001/profile/admin",
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
			const parseRes = await response.json();
			setDecks(parseRes.decks);
			setName(parseRes.user);
			setUsers(parseRes.users);

			console.log("ParseRes", parseRes);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				navigate("/login");
			}
		}
	}

	const onDeleteButton = async (e, deck_id) => {
		try {
			const body = { deck_id };
			console.log("Body", body);

			const response = await fetch(
				"http://localhost:3001/profile/admin/delete/deck",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);

			const parseRes = await response.json();
			console.log("ParseRes", parseRes);
		} catch (err) {
			console.error(err.message + "From ProfileDeck.js");
		}

		updateDecks(deck_id);
	};

	const onDeleteUser = async (e, user_id) => {
		try {
			const body = { user_id };
			console.log("Body", body);

			const response = await fetch(
				"http://localhost:3001/profile/delete/user",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);

			const parseRes = await response.json();
			console.log("ParseRes", parseRes);

			updateUsers(user_id);
		} catch (err) {
			console.error(err.message + "From ProfileDeck.js");
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1>Admin Console</h1>
			</div>
			<div className="col-xs-6">
				<h2 className="text-center">Decks</h2>
				<table className="table text-center table-hover">
					<thead>
						<tr>
							<th scope="col">Deck Name</th>
							<th scope="col">Deck Description</th>
							<th scope="col">Deck Owner</th>
							<th scope="col">Delete Deck</th>
						</tr>
					</thead>
					<tbody>
						{decks.map((deck) => (
							<tr key={deck.deck_id}>
								<td>{deck.deck_name}</td>
								<td>{deck.deck_description}</td>
								<td>{deck.user}</td>
								<td>
									<button
										className="btn btn-danger"
										onClick={(e) => {
											onDeleteButton(e, deck.deck_id);
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="col-xs-6">
				<h2 className="text-center">Users</h2>
				<table className="table text-center table-hover">
					<thead>
						<tr>
							<th scope="col">User Name</th>
							<th scope="col">User Email</th>
							<th scope="col">User Role</th>
							<th scope="col">Delete User</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.user_id}>
								<td>
									{user.user_firstname +
										" " +
										user.user_lastname}
								</td>
								<td>{user.user_email}</td>
								<td>{user.user_role}</td>
								<td>
									<button
										className="btn btn-danger"
										onClick={(e) => {
											onDeleteUser(e, user.user_id);
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Admin;

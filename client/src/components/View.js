import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const View = ({ setAuth }) => {
	const [deck, setDeck] = useState([]);
	const [cardsList, setCards] = useState([]);
	const { id } = useParams();
	// get the deck name and all its cards from the database
	async function fetchData() {
		// get the deck name and all its cards from the database at the localhost:3001/decks/:deck_id route
		try {
			const response = await fetch(
				`http://localhost:3001/study/view/info/${id}`,
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
			console.log("Response", response);

			const parseRes = await response.json();
			console.log("ParseRes", parseRes);
			setDeck(parseRes.deck);
			setCards(parseRes.cards);
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
			<h2>{deck.deck_name}</h2>
			<table className="table table-hover">
				<thead>
					<tr>
						<th>Question</th>
						<th>Answer</th>
					</tr>
				</thead>
				<tbody>
					{cardsList.map((card) => (
						<tr key={card.flashcard_id}>
							<td>{card.question}</td>
							<td>{card.answer}</td>
						</tr>
					))}
				</tbody>
			</table>
            <button className="btn btn-primary"
            onClick={() => window.location = "/dashboard"}>Back</button>
		</div>
	);
};

export default View;

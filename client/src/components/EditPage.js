import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const EditPage = ({ setAuth }) => {
	const { id } = useParams();
	// for each deck, render a card with deck_name and deck_description
	const [deck, setDeck] = useState([]);
	const [cardsList, setCards] = useState([]);
	const [newCard, setNewCard] = useState({
		flashcard_id: "",
		deck_id: "",
		question: "",
		answer: "",
		correct_count: "",
		incorrect_count: "",
	});
	const title = false;
	// destructure new card into flashcard_id, deck_id, question, answer, correct_count, incorrect_count
	const {
		flashcard_id,
		deck_id,
		question,
		answer,
		correct_count,
		incorrect_count,
	} = newCard;

	const [updatedAnswer, setUpdatedAnswer] = useState(answer);
	const [updatedQuestion, setUpdatedQuestion] = useState(question);

	// get the deck name and all its cards from the database
	async function fetchData() {
		// get the deck name and all its cards from the database at the localhost:3001/decks/:deck_id route
		try {
			const response = await fetch(
				`http://localhost:3001/profile/edit/${id}`,
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

	// method to pass a card to the modal
	const passCard = (card) => {
		setNewCard(card);
		console.log("NewCard", newCard);
	};

	// method to update the card in the modal
	const updateCard = async (e) => {
		e.preventDefault();
		try {
			// only send flashcard_id, question, answer to the backend
			const body = { flashcard_id, updatedQuestion, updatedAnswer };
			const response = await fetch(
				`http://localhost:3001/profile/edit/card`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);
			const parseRes = await response.json();
			// refresh the page
			window.location.reload();
		} catch (err) {
			console.error(err.message);
		}
	};

	// method to delete a card
	const deleteCard = async (e, card_id) => {
		e.preventDefault();
		try {
			const body = { card_id };
			const response = await fetch(
				`http://localhost:3001/profile/delete/card`,
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
			// refresh the page
			window.location.reload();
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			{/* page title is edit + deck name */}
			<h1 className="text-center">Edit {deck.deck_name}</h1>
			{/* Render a table with headings of question answer edit, delete  center table on the page*/}
			<table className="table text-center table-hover">
				<thead>
					<tr>
						<th>Question</th>
						<th>Answer</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{/* for each card in the deck, render a row with the question, answer, edit, and delete buttons */}
					{cardsList.map((card) => (
						<tr>
							<td>{card.question}</td>
							<td>{card.answer}</td>
							<td>
								<button
									class="btn btn-outline-warning"
									data-bs-toggle="modal"
									data-bs-target="#myModal"
									// display modal with card question and answer
									onClick={() => passCard(card)}
								>
									Edit
								</button>
							</td>
							<td>
								<button
									class="btn btn-outline-danger"
									onClick={(e) =>
										deleteCard(e, card.flashcard_id)
									}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div class="modal" id="myModal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title">Edit Card</h4>
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
							></button>
						</div>

						<div class="modal-body">
							<form>
								<div class="mb-3 mt-4">
									<input
										type="question"
										class="form-control"
										id="editQuestion"
										aria-describedby="edutQuestion"
										placeholder={newCard.question}
										value={updatedQuestion}
										onChange={(e) =>
											setUpdatedQuestion(e.target.value)
										}
									/>
								</div>
								<div class="mb-3">
									<input
										type="answer"
										class="form-control"
										id="editAnswer"
										aria-describedby="editAnswer"
										placeholder={newCard.answer}
										value={updatedAnswer}
										onChange={(e) =>
											setUpdatedAnswer(e.target.value)
										}
									/>
								</div>
								<button
									type="submit"
									class="btn btn-warning mt-3"
									onClick={(e) => updateCard(e)}
								>
									Submit Changes
								</button>
							</form>
						</div>

						<div class="modal-footer">
							<button
								type="button"
								class="btn btn-danger"
								data-bs-dismiss="modal"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* conditonally render card title if title=true */}
			{/* {title ? (
				<h1 className="text-center">{deck.deck_name}</h1>
			) : (
				<h1 className="text-center">im gay</h1>
			)} */}
		</div>
	);
};

export default EditPage;

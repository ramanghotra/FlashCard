import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const Deck = ({ decks }) => {
	// for each deck, render a card with deck_name and deck_description
	const [isClick, setClick] = useState(false);
	const [decksList, setDecks] = useState(decks);

	const navigate = useNavigate();

	const updateDecks = (deck_id) => {
		setDecks((prevDecks) => {
			return prevDecks.filter((deck) => deck.deck_id !== deck_id);
		});
	};

	// post to /favourites route in dashboard
	const onClick = async (e, deck_id) => {
		try {
			const body = { deck_id: deck_id };
			console.log("Body", body);

			const response = await fetch(
				"http://localhost:3001/dashboard/favourites",
				{
					method: "POST",
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
			console.error(err.message + "From Deck.js");
		}

		updateDecks();
	};

	const removeFavourite = async (e, deck_id) => {
		try {
			const body = { deck_id: deck_id };
			console.log("Body", body);

			const response = await fetch(
				"http://localhost:3001/dashboard/favourites",
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
			console.error(err.message + "From Deck.js");
		}

		updateDecks();
	};

	const onViewButtonClick = (e, deck_id) => {
		e.preventDefault();

		// navigate to view page at /view and send deck_id
		navigate(`/view/${deck_id}`);
	};

	const onStudyButtonClick = (e, deck_id) => {
		e.preventDefault();

		// navigate to study page at /study and send deck_id
		navigate(`/study/${deck_id}`);
	};

	return (
		<div className="row">
			{decksList.map((deck) => {
				return (
					<div className="col-sm-4">
						<div className="card mb-1">
							<div className="card-body">
								<h5 className="card-title ">
									{deck.deck_name}
								</h5>
								<p className="card-text">
									{deck.deck_description}
								</p>
								<button
									onClick={(e) => {
										onStudyButtonClick(e, deck.deck_id);
									}}
									class="btn btn-primary"
								>
									Study
								</button>
								<button
									class="btn btn-link"
									onClick={(e) => {
										onViewButtonClick(e, deck.deck_id);
									}}
								>
									View
								</button>
								{deck.favourite ? (
									<button
										className="btn btn-link btn-small"
										onClick={(e) => {
											removeFavourite(e, deck.deck_id);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											class="bi bi-heart-fill"
											viewBox="0 0 16 16"
										>
											<path
												fill-rule="evenodd"
												d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
											/>
										</svg>
									</button>
								) : (
									<button
										className="btn btn-link btn-small"
										onClick={(e) => {
											onClick(e, deck.deck_id);
											setClick(true);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											class="bi bi-heart"
											viewBox="0 0 16 16"
										>
											<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
										</svg>
									</button>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Deck;

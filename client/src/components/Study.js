import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Study = () => {
	const [deck, setDeck] = useState([]);
	const [cardsList, setCards] = useState([]);
	const { id } = useParams();
	const [numberOfCards, setNumberOfCards] = useState(0);
	const [numberOfCorrect, setNumberOfCorrect] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [cardIndex, setCardIndex] = useState(0);
	const [displayText, setDisplayText] = useState("");

	async function fetchData() {
		try {
			const response = await fetch(
				`http://localhost:3001/study/view/info/${id}`,
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);

			const parseRes = await response.json();
			console.log("im gay");
			console.log(parseRes);
			setDeck(parseRes.deck);
			setCards(parseRes.cards);
			setNumberOfCards(parseRes.cards.length);
			setInitialValues();
		} catch (err) {
			console.error(err.message);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const setInitialValues = () => {
		setNumberOfCards(cardsList.length);
		setNumberOfCorrect(0);
		setAccuracy(0);
		setCardIndex(1);
		setDisplayText("");
	};

	// const handleNext = () => {
    //     try {
    //         setCardIndex(cardIndex + 1);
    //         setDisplayText(cardsList[cardIndex].question);
    //     } catch (err) {
    //         console.error(err.message);
    //         setDisplayText("You have reached the end of the deck.");
    //         navigator.vibrate(1000);
    //     }

		
	// };

	return (
		<div>
			<h2>{deck.deck_name}</h2>
			<h3>Number of Cards: {cardsList.length}</h3>
			<h3>Number of Correct: {numberOfCorrect}</h3>
			<h3>Accuracy: {accuracy}</h3>
			<h3>{numberOfCards} Cards Remaining</h3>
			{/* <button className="btn btn-primary" onClick={handleNext}> */}
				Next
			{/* </button> */}
			{/* display first question */}
			<h3>{displayText}</h3>
		</div>
	);
};

export default Study;

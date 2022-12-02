import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const CreateCards = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [inputs, setInputs] = useState({
		question: "",
		answer: "",
	});
	const [successMessage, setSuccessMessage] = useState("");

	const state = useLocation().state;
	const deck_id = state.deck_id;

	console.log("State", state.deck_id);

	const { question, answer } = inputs;

	const clearForm = () => {
		console.log("Clearing form");
		setInputs({
			question: "",
			answer: "",
		});
	};

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { question, answer, deck_id };
			console.log("Body", body);

			// post to create cards route

			const response = await fetch("http://localhost:3001/create/cards", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			const parseRes = await response.json();
			if (parseRes) {
				setSuccessMessage("Card created successfully");
			} else {
				setSuccessMessage("Card creation failed");
			}

			clearForm();

			// set success message on successMessage label

			console.log("ParseRes", parseRes);
		} catch (err) {
			console.error(err.message + "From CreateCards.js");
			setAuth(false);
		}
	};

	const onChange = (e) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value });
	};

	return (
		<div>
			<h1 className="text-center">Create Cards</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group mb-3">
					<input
						type="text"
						className="form-control"
						id="question"
						placeholder="Question"
						value={question}
						onChange={(e) => onChange(e)}
						required={true}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						className="form-control"
						id="answer"
						placeholder="Answer"
						value={answer}
						onChange={(e) => onChange(e)}
						required={true}
					/>
				</div>
				{/* Small text that indicates success message */}
				<small id="emailHelp" className="form-text text-muted">
					{successMessage}
				</small>

				<div className="col-md-12 text-center mb-3">
					<button type="submit" className="btn btn-primary m-3">
						Submit Card
					</button>
					<Link to="/Dashboard">
						<button className="btn btn-primary m-3">
							Back to Dashboard
						</button>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default CreateCards;

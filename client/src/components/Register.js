import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ setAuth }) => {
	const [inputs, setInputs] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { firstname, lastname, email, password, confirmPassword } = inputs;

	const onChange = (e) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value });
	};

	const onSubmitForm = async (e) => {
		console.log("onSubmitForm");
		e.preventDefault();

		try {
			const body = { firstname, lastname, email, password };

			// if passwords dont match, return error
			if (password !== confirmPassword) {
				// set password fields to empty
				setInputs({ ...inputs, password: "", confirmPassword: "" });
				// set password fields to focus
				document.getElementById("password").focus();
				// clear password fields
				document.getElementById("password").value = "";
				document.getElementById("confirmPassword").value = "";

				// ensure password is at least 6 characters

				return alert("Passwords do not match");
			} else {
				// post request to backend
				const response = await fetch(
					"http://localhost:3001/auth/register",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body),
					}
				);

				const parseRes = await response.json();

				// only set token if login is successful
				if (parseRes.token) {
					localStorage.setItem("token", parseRes.token);
					setAuth(true);
				} else {
					setAuth(false);
					return alert(parseRes);
				}
				// redirect to login page
				window.location = "/dashboard";
			}
		} catch (err) {
			console.error(err.message + "From Register.js");
		}
	};

	return (
		<div>
			<h1 className="text-center my-5">Register</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group">
					<input
						type="text"
						required="True"
						className="form-control my-3"
						id="firstname"
						placeholder="First Name"
						defaultValue={firstname}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						required="True"
						className="form-control my-3"
						id="lastname"
						placeholder="Last Name"
						defaultValue={lastname}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						required="True"
						className="form-control mt-3"
						id="email"
						aria-describedby="emailHelp"
						placeholder="Enter email"
						defaultValue={email}
						onChange={(e) => onChange(e)}
					/>
					<small id="emailHelp" className="form-text text-muted">
						We'll never share your email with anyone else.
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
						className="form-control my-3"
						id="password"
						placeholder="Password"
						defaultValue={password}
						minLength="8"
						maxLength="20"
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						required="True"
						className="form-control my-3"
						id="confirmPassword"
						placeholder="Confirm Password"
						defaultValue={confirmPassword}
						onChange={(e) => onChange(e)}
					/>
				</div>

				<button type="submit" className="btn btn-primary col-12">
					Submit
				</button>
				<Link to="/login">Login</Link>
			</form>
		</div>
	);
};

export default Register;

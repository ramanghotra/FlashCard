import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	console.log("Login.js");
	const { email, password } = inputs;

	const onChange = (e) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value });
	};

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { email, password };
			const response = await fetch("http://localhost:3001/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const parseRes = await response.json();

			// only set token if login is successful
			if (parseRes.token) {
				localStorage.setItem("token", parseRes.token);
				setAuth(true);
				window.location = "/dashboard";
			} else {
				setAuth(false);

				return alert(parseRes);
			}
		} catch (err) {
			console.error(err.message + "From Login.js");
			setAuth(false);
		}
	};

	return (
		<Fragment>
			<h1 className="text-center my-5">Login</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group">
					<input
						type="text"
						className="form-control my-3"
						id="email"
						placeholder="Email"
						defaultValue={email}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						className="form-control my-3"
						id="password"
						placeholder="Password"
						defaultValue={password}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<button className="btn btn-success col-12">Submit</button>
				<Link to="/register">Register</Link>
			</form>
		</Fragment>
	);
};

export default Login;

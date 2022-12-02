import React, { useState, useEffect } from "react";
import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// components
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import Create from "./components/Create";
import CreateCards from "./components/CreateCards";
import { PrivateRouter } from "./router/privateRouter";
import Profile from "./components/Profile";
import EditPage from "./components/EditPage";
import Study from "./components/Study";
import View from "./components/View";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [logoutButtonText, setLogoutButtonText] = useState("Login");

	// Set the authentication state to true/false
	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	// Check if the user is authenticated
	const checkAuth = async () => {
		console.log("check auth");
		try {
			const response = await fetch("http://localhost:3001/auth/verify", {
				method: "GET",
				headers: { token: localStorage.token },
			});
			const parseRes = await response.json();
			console.log(parseRes);

			parseRes === true
				? setIsAuthenticated(true)
				: setIsAuthenticated(false);

			console.log("isAuthenticated: parse" + isAuthenticated);

			if (setIsAuthenticated === true) {
				setLogoutButtonText("Logout");
			} else {
				setLogoutButtonText("Login");
			}
		} catch (err) {
			console.log("err", err);
			console.error(err?.message + " from App.js");
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	console.log("isAuthenticated: " + isAuthenticated, loading);

	return (
		<>
			<NavBar setAuth={setAuth} text={logoutButtonText} />
			<div className="container">
				<Router>
					<>
						<Routes>
							{!isAuthenticated && !localStorage.token && (
								<>
									<Route
										path="/login"
										element={<Login setAuth={setAuth} />}
									/>
									<Route
										path="/register"
										element={<Register setAuth={setAuth} />}
									/>
									<Route
										path="/:page"
										element={
											<Navigate to="/login" replace />
										}
									/>
									<Route
										path="/"
										element={
											<Navigate to="/login" replace />
										}
									/>
								</>
							)}
							{isAuthenticated && (
								<>
									<Route
										path="/dashboard"
										element={<Dashboard />}
									/>
									<Route
										path="/create/cards"
										element={<CreateCards />}
									/>
									<Route
										path="/create"
										element={<Create />}
									/>
									<Route
										path="/profile"
										element={<Profile />}
									/>
									<Route
										path="/profile/edit/:id"
										element={<EditPage />}
									/>
									<Route path="/study/:id" element={<Study />} />
									<Route path="/view/:id" element={<View />} />
								</>
							)}
						</Routes>
					</>
				</Router>
			</div>
		</>
	);
}

export default App;

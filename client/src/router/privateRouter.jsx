import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Redirect,
	Navigate,
} from "react-router-dom";

import Dashboard from "../components/Dashboard";
import Create from "../components/Create";

export const PrivateRouter = () => {
	const token = localStorage.token;
	console.log('token', token);
	return token ? (
		<>
			<Route
				path="/dashboard"
				element={<Dashboard />}
			/>
			<Route path="/create" element={<Create />} />

			{/* // create redirects to another page */}
		</>
	) : (
		<Navigate to={"/"} />
	);
};

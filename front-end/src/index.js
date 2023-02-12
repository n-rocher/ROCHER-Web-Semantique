import React from "react";
import ReactDOM from "react-dom/client";

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import Root from "./template/Root";
import Home from "./routes/Home";
import Driver from "./routes/Driver";
import Constructor from "./routes/Constructor";
import ErrorPage from "./error-page";
import GrandPrix from "./routes/GrandPrix";

import { EuiProvider } from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';

import * as SPARQL from "./sparql";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
	}, {
		path: "/grand-prix/:grandPrix_IRI",
		element: <GrandPrix />,
		errorElement: <ErrorPage />,
		loader: async ({ params }) => {
			return Promise.all([SPARQL.getGrandPrix(params.grandPrix_IRI), SPARQL.getResults(params.grandPrix_IRI)])
		},
	}, {
		path: "/driver/:driver_IRI",
		element: <Driver />,
		errorElement: <ErrorPage />,
		loader: async ({ params }) => {
			return Promise.all([SPARQL.getDriver(params.driver_IRI), SPARQL.getDriverResults(params.driver_IRI), SPARQL.getDriverPointsByYear(params.driver_IRI)])
		},
	}, {
		path: "/constructor/:constructor_IRI",
		element: <Constructor />,
		errorElement: <ErrorPage />,
		loader: async ({ params }) => {
			return Promise.all([SPARQL.getConstructor(params.constructor_IRI), SPARQL.getConstructorDrivers(params.constructor_IRI)])
		},
	}
])

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<EuiProvider colorMode="light">
			<Root>
				<RouterProvider router={router} />
			</Root>
		</EuiProvider>
	</React.StrictMode>
);
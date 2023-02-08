import React from "react";
import ReactDOM from "react-dom/client";

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import Root from "./template/Root";
import Home from "./routes/Home";
import ErrorPage from "./error-page";
import GrandPrix from "./routes/GrandPrix";

import { EuiProvider } from '@elastic/eui';

import '@elastic/eui/dist/eui_theme_light.css';

import { getGrandPrix, getResults } from "./sparql";


const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/grand-prix/:grandPrix_IRI",
		element: <GrandPrix />,
		errorElement: <ErrorPage />,
		loader: async ({ params }) => {
			return Promise.all([getGrandPrix(params.grandPrix_IRI), getResults(params.grandPrix_IRI)])
		},
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<EuiProvider colorMode="light">
			<Root>
				<RouterProvider router={router} />
			</Root>
		</EuiProvider>
	</React.StrictMode>
);
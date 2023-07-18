import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import Home from './components/pages/Home'
import Products from './components/pages/Products.jsx'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
]);

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById("root")
);

// index.jsx
import React from "react"; // for using React elements
import { createRoot } from "react-dom/client"; // for using createRoot function
import  App  from "./App"; // for importing the App component

// use the createRoot function to render the App component to the DOM
const root = document.getElementById("root");
createRoot(root).render(
    <App />
);

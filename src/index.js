import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Weather from "./Weather";
const rootElement = document.getElementById("root");
ReactDOM.render(<Weather />, rootElement);

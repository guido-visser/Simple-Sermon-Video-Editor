import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "@/scss/tweaks.scss";
import "./index.scss";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

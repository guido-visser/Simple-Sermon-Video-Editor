import React from "react";
import "./App.scss";
import wretch from "wretch";
import "./Logic/Network";

function App() {
    const handleClick = () => {
        wretch("/merge")
            .get()
            .json((res) => console.log(res));
    };

    return (
        <div className="App">
            <button onClick={handleClick}>Ping</button>
        </div>
    );
}

export default App;

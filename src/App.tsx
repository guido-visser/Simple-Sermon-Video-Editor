import React from "react";
import "./App.scss";
import wretch from "wretch";

class App extends React.PureComponent<any, any> {
    state = { timemark: "00:00:00:00", fps: 0 };
    componentDidMount() {
        this.poll();
    }

    poll = () => {
        wretch("/poll")
            .get()
            .json((res) => {
                if (res.action === "renderUpdate") {
                    this.setState({ timemark: res.timemark, fps: res.currentFps });
                }
                this.poll();
            })
            .catch((error) => {
                console.error(error);
                this.poll();
            });
    };

    handleClick = () => {
        wretch("/merge")
            .get()
            .json((res) => console.log(res));
    };

    handleTestClick = () => {
        wretch("/test")
            .get()
            .json((res) => console.log(res));
    };

    render() {
        const { timemark, fps } = this.state;
        return (
            <div className="App">
                <button onClick={this.handleClick}>Merge files</button>
                <button onClick={this.handleTestClick}>Test</button>
                <div>Timemark: {timemark}</div>
                <div>FPS: {fps}</div>
            </div>
        );
    }
}

export default App;

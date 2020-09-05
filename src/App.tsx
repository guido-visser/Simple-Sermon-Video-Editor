import React from "react";
import "./App.scss";
import wretch from "wretch";
import { Input } from "antd";

class App extends React.PureComponent<any, any> {
    state = { timemark: "00:00:00:00", fps: 0, file1: "", file2: "", file3: "" };
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
        const { file1, file2, file3 } = this.state;
        wretch("/merge")
            .post({ file1, file2 })
            .json((res) => console.log(res));
    };

    handleTestClick = () => {
        wretch("/test")
            .get()
            .json((res) => console.log(res));
    };

    handleStop = () => {
        wretch("/stop")
            .get()
            .json((res) => console.log(res));
    };

    handleFileInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [name]: event.target.value });
    };

    render() {
        const { timemark, fps, file1, file2, file3 } = this.state;
        return (
            <div className="App">
                <button onClick={this.handleClick}>Merge files</button>
                <button onClick={this.handleTestClick}>Test</button>
                <button onClick={this.handleStop}>Stop</button>
                <div>Timemark: {timemark}</div>
                <div>FPS: {fps}</div>
                <div>
                    <Input value={file1} onChange={this.handleFileInputChange("file1")} placeholder="Video file 1" />
                    <Input value={file2} onChange={this.handleFileInputChange("file2")} placeholder="Video file 2" />
                    <Input value={file3} onChange={this.handleFileInputChange("file3")} placeholder="Video file 3" />
                </div>
            </div>
        );
    }
}

export default App;

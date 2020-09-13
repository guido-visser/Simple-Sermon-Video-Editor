import React from "react";
import "./App.scss";
import wretch from "wretch";
import { Layout, Menu } from "antd";
import GvUpload from "./components/GvUpload";
import { VideoItem } from "./interfaces/Types";

const { Header, Sider, Content, Footer } = Layout;

interface State {
    timemark: string;
    fps: number;
    videos: VideoItem[];
}

class App extends React.PureComponent<any, any> {
    state: State = { timemark: "00:00:00:00", fps: 0, videos: [] };
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
                if (res.action === "uploadComplete") {
                }
                this.poll();
            })
            .catch((error) => {
                console.error(error);
                this.poll();
            });
    };

    handleClick = () => {};

    addVideoToState = (videoItem: VideoItem) => {
        const { videos } = this.state;
        this.setState({
            videos: [...videos, { ...videoItem }],
        });
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
        const { videos } = this.state;
        return (
            <div className="App">
                <Layout>
                    <Sider>
                        <Menu defaultSelectedKeys={["start"]} theme="dark">
                            <Menu.Item key="start">Start</Menu.Item>
                            {videos.map((vi, index) => (
                                <Menu.Item key={vi.location}>File {index + 1}</Menu.Item>
                            ))}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header>Simple Sermon Video Editor</Header>
                        <Content>
                            <GvUpload onUploadComplete={this.addVideoToState} />
                        </Content>
                        <Footer>
                            <div className="credits">By Guido Visser</div>
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default App;

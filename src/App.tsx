import React from "react";
import "./App.scss";
import wretch from "wretch";
import { Layout, Menu } from "antd";
import GvUpload from "./components/GvUpload";
import { VideoItem } from "./interfaces/Types";
import VideoPage from "./pages/Video";
import _, { Dictionary } from "lodash";

const { Header, Sider, Content, Footer } = Layout;

interface State {
    timemark: string;
    fps: number;
    videos: VideoItem[];
    selectedMenuItem: string;
    videosIndex: Dictionary<VideoItem>;
}

class App extends React.PureComponent<any, any> {
    state: State = { timemark: "00:00:00:00", fps: 0, videos: [], selectedMenuItem: "start", videosIndex: {} };
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

    addVideoToState = (videoItem: VideoItem) => {
        const { videos, videosIndex } = this.state;
        let newVideoIndexes = { ...videosIndex, [videoItem.id]: videoItem };

        this.setState({
            videos: [...videos, { ...videoItem }],
            videosIndex: newVideoIndexes,
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

    renderContent = () => {
        const { selectedMenuItem, videosIndex } = this.state;
        const vi = videosIndex[selectedMenuItem];
        if(selectedMenuItem === 'start'){
            return <GvUpload onUploadComplete={this.addVideoToState} />;
        } else {
            return <VideoPage videoItem={vi} />;
        }
    };

    render() {
        const { videos, selectedMenuItem } = this.state;
        return (
            <div className="App">
                <Layout>
                    <Sider>
                        <Menu
                            selectedKeys={[selectedMenuItem]}
                            onClick={(event) => this.setState({ selectedMenuItem: event.key })}
                            theme="dark"
                        >
                            <Menu.Item key="start">Start</Menu.Item>
                            {videos.map((vi, index) => (
                                <Menu.Item key={vi.id}>File {index + 1}</Menu.Item>
                            ))}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header>Simple Sermon Video Editor</Header>
                        <Content>{this.renderContent()}</Content>
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

import React from "react";
import "./App.scss";
import wretch from "wretch";
import { Layout, Menu } from "antd";
import GvUpload from "./components/GvUpload";

const { Header, Sider, Content, Footer } = Layout;

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

    handleClick = () => {};

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
        return (
            <div className="App">
                <Layout>
                    <Sider>
                        <Menu defaultSelectedKeys={["start"]} theme="dark">
                            <Menu.Item key="start">Start</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header>Simple Sermon Video Editor</Header>
                        <Content>
                            <GvUpload />
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

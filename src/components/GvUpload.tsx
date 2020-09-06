import React, { PureComponent } from "react";
import { Upload, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "./GvUpload.scss";

interface State {
    loading: boolean;
}

class GvUpload extends PureComponent {
    state: State = { loading: false };

    handleUpload = (info: UploadChangeParam<UploadFile<any>>) => {};

    render() {
        const { loading } = this.state;
        const props = {
            name: "file",
            multiple: true,
            action: "/api/main/upload",
            onChange(info: UploadChangeParam<UploadFile<any>>) {
                const { status } = info.file;
                if (status !== "uploading") {
                    console.log(info.file, info.fileList);
                }
                if (status === "done") {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <div className="uploadField">
                <Upload.Dragger {...props}>Drag files here to upload</Upload.Dragger>
            </div>
        );
    }
}

export default GvUpload;

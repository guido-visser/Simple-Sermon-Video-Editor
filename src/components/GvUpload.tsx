import React, { PureComponent } from "react";
import { Upload, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import "./GvUpload.scss";
import { VideoItem } from "@/interfaces/Types";

interface State {
    loading: boolean;
}

interface GvUploadProps {
    onUploadComplete?: (videoItem: VideoItem) => void;
}

class GvUpload extends PureComponent<GvUploadProps> {
    state: State = { loading: false };

    render() {
        const { loading } = this.state;
        const props = {
            name: "file",
            multiple: true,
            action: "/api/main/upload",
            onChange: (info: UploadChangeParam<UploadFile<any>>) => {
                const { status } = info.file;
                const { onUploadComplete } = this.props;
                if (status !== "uploading") {
                    console.log(info.file, info.fileList);
                }
                if (status === "done") {
                    message.success(`${info.file.name} file uploaded successfully.`);
                    if (onUploadComplete) {
                        onUploadComplete(info.file.response);
                    }
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

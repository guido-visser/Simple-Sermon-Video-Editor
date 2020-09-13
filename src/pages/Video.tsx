import { VideoItem } from "@/interfaces/Types";
import React from "react";
import ReactPlayer from "react-player";

interface VideoPageProps {
    videoItem: VideoItem;
}

const VideoPage = (props: VideoPageProps) => {
    return (
        <>
            <ReactPlayer url={props.videoItem.location} />
        </>
    );
};

export default VideoPage;

import React from "react";

const VideoIframe = ({ url, height, width, className }) => {
  var video_id = url?.split("v=")[1];
  var ampersandPosition = video_id?.indexOf("&");
  if (ampersandPosition != -1) {
    video_id = video_id?.substring(0, ampersandPosition);
  }
  return (
    url && (
      <div className={`video-guideline-iframe ${className}`}>
        {video_id && url?.toString().includes("www.youtube.com") ? (
          <iframe
            width={width || "100%"}
            height={height || "100%"}
            src={`https://www.youtube.com/embed/${video_id}`}
            frameBorder="0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        ) : (
          <video controls width={width || "100%"} height={height || "100%"}>
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    )
  );
};

export default VideoIframe;

import React from "react";

const Video = ({ module }) => {
  if (!module.body) module.body = placeholder;
  const { src, type, title, backgroundColor } = module.body;

  const titleStyle = {
    backgroundColor: "rgba(119,119,119,.2)",
    padding: ".75rem",
    maxHeight: "90%",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  return (
    <div className="w-100 h-100" style={{ color: backgroundColor }}>
      <h6 className="position-absolute" style={titleStyle}>
        {title}
      </h6>
      <video className="w-100 h-100" controls>
        <source src={src} />
      </video>
    </div>
  );
};

const placeholder = {
  src: "/video-placeholder.mp4",
  title: "Video title",
};

export default Video;

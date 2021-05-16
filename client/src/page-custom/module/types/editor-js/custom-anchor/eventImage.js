import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { isEmptyObject } from "../../../../../utils/functions";

const DEFAULT_INITIAL_DATA = () => {
  return {
    id: "1",
    src: "https://picsum.photos/800",
    alt: "image",
    title: {
      enable: true,
      text: "Title placeholder",
    },
    subtitle: {
      enable: true,
      text: "Subtitle placeholder",
    },
    objectFit: "none",
  };
};

const EventImage = (props) => {
  const initState =
    props.data && !isEmptyObject(props.data)
      ? props.data
      : DEFAULT_INITIAL_DATA;

  const [imgData, setImgData] = useState(initState);

  const updateTimelineData = (newData) => {
    setImgData(newData);
    if (props.onDataChange) {
      props.onDataChange(newData);
    }
  };

  const onContentChange = (fieldName, e) => {
    const newData = {
      ...imgData,
    };
    newData[fieldName].text = e.currentTarget.textContent;
    updateTimelineData(newData);
  };

  const { id, src, alt, title, subtitle, objectFit } = imgData;

  const imgStyle = {
    objectFit: objectFit,
    height: "100%",
  };

  const titleStyle = {
    backgroundColor: "rgba(119,119,119,.5)",
    padding: ".75rem",
  };

  const subtitleStyle = {
    fontSize: "1rem",
    backgroundColor: "rgb(101,116,136,.8)",
    padding: ".25rem .75rem",
    display: "inline-block",
    margin: "0",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  return (
    <Card key={id} className="text-white">
      <Card.Img src={src} alt={alt} style={imgStyle} />
      {/* className="d-flex p-0 m-0" */}
      <Card.ImgOverlay>
        {subtitle.enable && (
          <Card.Title
            style={subtitleStyle}
            className="align-self-end"
            contentEditable
            onBlur={(e) => onContentChange("subtitle", e)}
          >
            {subtitle.text}
          </Card.Title>
        )}
        {title.enable && (
          <Card.Title
            style={titleStyle}
            className="align-self-end"
            onBlur={(e) => onContentChange("title", e)}
          >
            {title?.text}
          </Card.Title>
        )}
      </Card.ImgOverlay>
    </Card>
  );
};

export default EventImage;

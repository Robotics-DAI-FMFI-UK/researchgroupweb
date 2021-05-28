import React from "react";
import Card from "react-bootstrap/Card";
import uuid from "react-uuid";

const Image = ({ module }) => {
  if (!module.body) module.body = placeholder;
  const {
    src,
    alt,
    title,
    subtitle,
    objectFit,
    reference,
    backgroundColor,
  } = module.body;

  const imgStyle = {
    objectFit: objectFit,
    height: "100%",
  };

  const cardStyle = {
    backgroundColor: backgroundColor,
    cursor: reference ? "pointer" : "",
    height: "100%",
  };

  const titleStyle = {
    backgroundColor: "rgba(119,119,119,.5)",
    padding: ".75rem",
    maxHeight: "90%",
    textOverflow: "ellipsis",
    overflow: "hidden",
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

  const overlayStyle = {
    top: "unset",
  };

  return (
    <Card key={module._id || uuid()} className="text-white" style={cardStyle}>
      <Card.Img src={src} alt={alt} style={imgStyle} />
      <Card.ImgOverlay style={overlayStyle}>
        {subtitle && (
          <Card.Title style={subtitleStyle} className="align-self-end">
            {subtitle}
          </Card.Title>
        )}
        {title && (
          <Card.Title style={titleStyle} className="align-self-end">
            {title}
          </Card.Title>
        )}
      </Card.ImgOverlay>
    </Card>
  );
};

const placeholder = {
  src: "/img-placeholder.jpg",
  alt: "image",
  title: "Title",
  subtitle: "Subtitle placeholder",
  objectFit: "none",
};

export default Image;

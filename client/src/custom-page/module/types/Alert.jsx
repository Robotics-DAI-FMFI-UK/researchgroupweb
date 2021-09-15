import React from "react";
import { Alert as BsAlert } from "react-bootstrap";

const Alert = ({ module }) => {
  const { heading, message, variant } = module.body;

  const style = {
    height: "100%",
    marginBottom: "0",
  };

  return (
    <BsAlert style={style} variant={variant}>
      <BsAlert.Heading>{heading}</BsAlert.Heading>
      <p>{message}</p>
    </BsAlert>
  );
};

export default Alert;

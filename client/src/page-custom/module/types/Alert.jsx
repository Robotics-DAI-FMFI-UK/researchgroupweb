import React from "react";
import { Alert as BsAlert } from "react-bootstrap";

const Alert = ({ module }) => {
  if (!module.body) module.body = placeholder;
  const { heading, message, variant } = module.body;

  const style = {
    // overflowY: "auto",
    // height: "inherit",
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

const placeholder = {
  heading: "Alert header!",
  message: "A long text message of the alert",
  variant: "warning",
};

export default Alert;

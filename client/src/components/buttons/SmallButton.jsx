import React from "react";
import Button from "react-bootstrap/Button";

const SmallButton = ({ variant = "dark", className, ...rest }) => {
  return <Button variant={variant} size="sm" className={className} {...rest} />;
};

export default SmallButton;

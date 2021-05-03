import React from "react";
import { Form, Input, Select } from "../../../components/forms/MyForm";

const AlertForm = ({ SelectPageRef, ...props }) => {
  const variants = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ];

  return (
    <Form {...props}>
      <Input name="heading" as="textarea" />
      <Input name="message" as="textarea" rows={10} />
      <Select name="variant" options={variants} />
      {SelectPageRef}
    </Form>
  );
};

export default AlertForm;

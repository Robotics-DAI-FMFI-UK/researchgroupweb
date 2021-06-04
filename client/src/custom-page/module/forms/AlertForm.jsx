import React from "react";
import { Form, Input, Select } from "../../../components/forms/MyForm";
import ReferenceField from "./ReferenceField";

const AlertForm = ({
  activeModule,
  handleChange,
  onSubmit,
  origin,
  setOrigin,
  isRestored,
}) => {
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
    <Form
      defaultValues={activeModule.body}
      handleChange={handleChange}
      onSubmit={onSubmit}
      origin={origin}
      activeModule={activeModule}
      setOrigin={setOrigin}
      isRestored={isRestored}
    >
      <Input name="heading" as="textarea" />
      <Input name="message" as="textarea" rows={10} />
      <Select name="variant" options={variants} />
      <ReferenceField activeModule={activeModule} handleChange={handleChange} />
    </Form>
  );
};

export default AlertForm;

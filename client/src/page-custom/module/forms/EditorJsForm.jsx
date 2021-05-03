import React from "react";
import { Form, Input } from "../../../components/forms/MyForm";

const EditorJsForm = ({ SelectPageRef, ...props }) => {
  return (
    <Form {...props}>
      <Input name="shortcuts" />
    </Form>
  );
};

export default EditorJsForm;

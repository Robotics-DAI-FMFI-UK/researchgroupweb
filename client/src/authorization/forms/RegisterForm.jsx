import React from "react";
import { Form, Input, Submit, Error } from "../../components/forms/MyForm";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email(),
  password: Yup.string().min(4, "Use at least 4 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const RegisterForm = ({ handleSubmit, authError }) => {
  return (
    <Form onSubmit={handleSubmit} validationSchema={validationSchema}>
      <Input name="name" required />
      {/*rules={{ minLength: { value: 5, message: "error message" } }}*/}
      <Input name="email" required />
      <Input name="password" type="password" required />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        required
      />
      <Error error={authError} />
      <Submit className="btn-block">Register</Submit>
    </Form>
  );
};

export default RegisterForm;

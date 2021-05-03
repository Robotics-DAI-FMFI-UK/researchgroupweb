import React from "react";
import { Error, Form, Input, Submit } from "../../components/forms/MyForm";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";

const UserInfoForm = (props) => {
  const { register, handleSubmit } = useForm({
    defaultValues: props.defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <FormGroup>
        <FormLabel>Current password</FormLabel>
        <FormControl
          type="password"
          name="password"
          placeholder="Enter current password"
          ref={register}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>New password</FormLabel>
        <FormControl
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          ref={register}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Confirm new password</FormLabel>
        <FormControl
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          ref={register}
          required
        />
      </FormGroup>

      <Error error={props.error} />
      <Submit className="btn-block">Save</Submit>
    </form>
  );
};

export default UserInfoForm;

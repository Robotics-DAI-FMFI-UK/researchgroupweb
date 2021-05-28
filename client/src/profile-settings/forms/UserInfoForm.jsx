import React from "react";
import { Error, Submit } from "../../components/forms/MyForm";
import { useForm } from "react-hook-form";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

const UserInfoForm = (props) => {
  const { register, handleSubmit } = useForm({
    defaultValues: props.defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <FormGroup>
        <FormLabel>Name</FormLabel>
        <FormControl
          type="text"
          name="name"
          placeholder="Enter name"
          ref={register}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormControl
          type="text"
          name="email"
          placeholder="Enter email"
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

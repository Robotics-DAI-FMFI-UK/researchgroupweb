import React from "react";
import { BsExclamationTriangle } from "react-icons/bs";
import { useForm } from "react-hook-form";
import {
  Button,
  Form as F,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
} from "react-bootstrap";
import { upperFirst } from "lodash";

import { useYupResolver } from "../../utils/hooks/useYupResolver";
import * as Yup from "yup";

export const Error = ({ error }) => {
  if (!error) return null;
  return (
    <p style={{ color: "red" }}>
      <BsExclamationTriangle /> {error}
    </p>
  );
};

// src: https://react-hook-form.com/advanced-usage/#SmartFormComponent
export function Form({
  defaultValues,
  children,
  onSubmit,
  handleChange,
  validationSchema,
  ...rest
}) {
  // console.log("this is  my form");
  const resolver = useYupResolver(validationSchema || Yup.object({}));
  const methods = useForm({
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const renderChild = (child) => {
    const childName = child?.props?.name;
    const value = defaultValues ? defaultValues[childName] : undefined;
    return (
      <>
        {childName
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                onChange: handleChange,
                register: methods.register,
                key: child.props.name,
                value: value,
              },
            })
          : child}
        {errors[childName] && <Error error={errors[childName].message} />}
      </>
    );
  };

  return (
    <F onSubmit={handleSubmit(onSubmit)} {...rest}>
      {Array.isArray(children) ? children.map(renderChild) : children}
    </F>
  );
}

export function Input({
  register,
  label,
  placeholder,
  type = "text",
  as,
  prepend,
  rows,
  ...rest
}) {
  label = label || rest.name;
  placeholder = placeholder ? placeholder : `Enter ${label}`;

  return (
    <FormGroup>
      <FormLabel>{upperFirst(label)}</FormLabel>
      {prepend ? (
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>{prepend}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type={type}
            placeholder={placeholder}
            ref={register}
            as={as}
            rows={rows}
            {...rest}
          />
          {/*<Control />*/}
        </InputGroup>
      ) : (
        <FormControl
          type={type}
          placeholder={placeholder}
          ref={register}
          as={as}
          rows={rows}
          {...rest}
        />
        // <Control />
      )}
    </FormGroup>
  );
}

export function Select({ register, options, label, ...rest }) {
  label = label || rest.name;

  const selectOptions = () => {
    return (
      <>
        <option hidden value="">
          Select option ...
        </option>
        {options.map((value, i) => (
          <option key={`${value}_${i}`} value={value}>
            {value}
          </option>
        ))}
      </>
    );
  };

  return (
    <FormGroup>
      <FormLabel>{upperFirst(label)}</FormLabel>
      <FormControl as="select" label={label} ref={register} {...rest}>
        {selectOptions()}
      </FormControl>
    </FormGroup>
  );
}

export function Switch({ register, label, ...rest }) {
  label = label || rest.name;

  return (
    <FormGroup>
      <F.Switch
        id={rest.name}
        label={upperFirst(label)}
        ref={register}
        {...rest}
      />
    </FormGroup>
  );
}

export function Check({ register, defaultValue, type, name, label, ...rest }) {
  label = label || name;

  return (
    <FormGroup>
      <F.Check
        ref={register}
        // defaultChecked={defaultValue}
        type="checkbox"
        name={name}
        {...rest}
      />
      {label}
    </FormGroup>
  );
}

export function Submit({ register, variant = "dark", ...rest }) {
  return (
    <Button type="submit" className="btn-block" variant={variant} {...rest} />
  );
}

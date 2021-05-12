import React, { useEffect } from "react";
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

import { useYupResolver } from "../../utils/hooks/useYupResolver";
import * as Yup from "yup";
import { upperFirst } from "../../utils/functions";

export const Error = ({ error }) => {
  if (!error) return null;
  return (
    <p style={{ color: "red" }}>
      <BsExclamationTriangle /> {error}
    </p>
  );
};

// src: https://react-hook-form.com/advanced-usage/#SmartFormComponent
// export const Forms = React.memo((props => ))
export function Form({
  defaultValues,
  children,
  onSubmit,
  handleChange,
  validationSchema,
  ...rest
}) {
  const resolver = useYupResolver(validationSchema || Yup.object({}));
  const methods = useForm({
    resolver,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const renderChild = (child) => {
    if (!child) return null;

    const childName = child.props?.name;
    const onChange = child.props?.onChange || handleChange;
    // const value = defaultValues ? defaultValues[childName] : undefined;
    return (
      <>
        {childName
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                onChange: onChange,
                register: methods.register,
                key: child.props.name,
                // value: value,
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
  prepend,
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
            {...rest}
          />
          {/*<Control />*/}
        </InputGroup>
      ) : (
        <FormControl
          type={type}
          placeholder={placeholder}
          ref={register}
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
      <F.Switch label={upperFirst(label)} ref={register} {...rest} />
    </FormGroup>
  );
}

export function Check({ register, label, ...rest }) {
  label = label || rest.name;

  return (
    <FormGroup>
      <input ref={register} type="checkbox" {...rest} />
      <span className="px-2">{label}</span>
    </FormGroup>
  );
}

export function Submit({ register, variant = "dark", ...rest }) {
  return (
    <Button type="submit" className="btn-block" variant={variant} {...rest} />
  );
}

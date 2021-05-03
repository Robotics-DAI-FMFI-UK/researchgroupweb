import React from "react";
import { Form, Input } from "../../../components/forms/MyForm";
import { useForm } from "react-hook-form";

const HtmlForm = ({ SelectPageRef, ...props }) => {
  const { register, watch } = useForm({
    defaultValues: props.defaultValues,
  });

  const _embed = watch("embed");

  return (
    <>
      <Form {...props}>
        <form>
          <div>
            <input
              ref={register}
              type="checkbox"
              name="embed"
              onChange={() =>
                props.handleChange({
                  target: {
                    name: "embed",
                    value: !_embed,
                  },
                })
              }
            />
            <span className="px-2">Embedded (iframe)</span>
          </div>
        </form>
        <Input
          name="html"
          label="Paste html code"
          required
          as="textarea"
          rows={20}
        />
      </Form>
    </>
  );
};

export default HtmlForm;

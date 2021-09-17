import React, { useRef } from "react";
import { Form, Input, Check } from "../../../components/forms/MyForm";

const HtmlForm = ({
  activeModule,
  handleChange,
  onSubmit,
  origin,
  setOrigin,
  isRestored,
}) => {
  const embed = useRef(activeModule.body.embed);
  const full_height = useRef(activeModule.body.full_height);
  const full_width = useRef(activeModule.body.full_width);

  const toggleEmbed = () => {
    embed.current = !embed.current;
    return embed.current;
  };
  const toggle_full_height = () => {
    full_height.current = !full_height.current;
    return full_height.current;
  };
  const toggle_full_width = () => {
    full_width.current = !full_width.current;
    return full_width.current;
  };

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
      <Check
        name="embed"
        label="Embedded (iframe)"
        onChange={() =>
          handleChange({
            target: {
              name: "embed",
              value: toggleEmbed(),
            },
          })
        }
      />
      <Check
        name="full_height"
        label="100% height"
        onChange={() =>
          handleChange({
            target: {
              name: "full_height",
              value: toggle_full_height(),
            },
          })
        }
      />
      <Check
        name="full_width"
        label="100% width"
        onChange={() =>
          handleChange({
            target: {
              name: "full_width",
              value: toggle_full_width(),
            },
          })
        }
      />
      <Input
        name="html"
        label="Paste html code"
        required
        as="textarea"
        rows={20}
      />
    </Form>
  );
};

export default HtmlForm;

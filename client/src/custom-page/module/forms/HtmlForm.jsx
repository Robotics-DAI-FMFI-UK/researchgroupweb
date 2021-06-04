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

  const toggleEmbed = () => {
    embed.current = !embed.current;
    return embed.current;
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

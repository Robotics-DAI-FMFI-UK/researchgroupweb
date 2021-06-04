import React, { useEffect, useRef, useState } from "react";
import { Check, Form, Input, Select } from "../../../components/forms/MyForm";
import UploadFileMultiple from "../../../components/upload/UploadFileMultiple";
import { Image } from "react-bootstrap";
import SmallButton from "../../../components/buttons/SmallButton";
import ReferenceField from "./ReferenceField";

const CarouselForm = ({
  activeModule,
  handleChange,
  onSubmit,
  origin,
  setOrigin,
  isRestored,
}) => {
  const options = ["fill", "contain", "cover", "none", "scale-down"];
  const defaultItem = "/img-placeholder.jpg";

  const [items, setItems] = useState(activeModule.body.items);
  useEffect(() => {
    setItems(activeModule.body.items);
  }, [activeModule.body.items]);

  const checkValues = useRef({
    indicators: activeModule.body.indicators,
    controls: activeModule.body.controls,
    allowPause: activeModule.body.allowPause,
    fade: activeModule.body.fade,
  });

  const onCheckChange = (e) => {
    const name = e.target.name;

    const toggleEmbed = () => {
      checkValues.current[name] = !checkValues.current[name];
      return checkValues.current[name];
    };

    handleChange({
      target: {
        name: name,
        value: toggleEmbed(),
      },
    });
  };

  const renderImage = (image) => {
    const removeItem = () => {
      setItems((prev) => {
        let update = prev.filter((img) => img !== image);

        if (!update.length) update = [defaultItem, defaultItem];

        handleChange({
          target: {
            name: "items",
            value: update,
          },
        });

        return update;
      });
    };

    return (
      <div className="m-1 d-inline-block">
        <SmallButton
          variant="light"
          className="position-absolute"
          onClick={removeItem}
        >
          &times;
        </SmallButton>
        <Image
          alt={image}
          src={image}
          style={{
            maxWidth: "225px",
            maxHeight: "225px",
          }}
        />
      </div>
    );
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
      <Check name="indicators" onChange={onCheckChange} />
      <Check name="controls" onChange={onCheckChange} />
      <Check
        name="allowPause"
        label="Pause on hover"
        onChange={onCheckChange}
      />
      <Check name="fade" label="Fade animation" onChange={onCheckChange} />
      <hr />
      <Select name="objectFit" options={options} />
      <Input name="interval" prepend="in seconds" type="number" />
      <Input name="backgroundColor" />
      <ReferenceField activeModule={activeModule} handleChange={handleChange} />
      <hr />
      <label className="form-label">Upload images</label>
      <UploadFileMultiple onUploadChange={handleChange} setItems={setItems} />
      <div className="my-2">{items.map(renderImage)}</div>
    </Form>
  );
};

export default CarouselForm;

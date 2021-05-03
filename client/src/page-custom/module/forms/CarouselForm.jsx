import React, { useState } from "react";
import { Form, Input, Select } from "../../../components/forms/MyForm";
import { useForm } from "react-hook-form";
import UploadFileMultiple from "../../../components/upload/UploadFileMultiple";
import { Image } from "react-bootstrap";
import SmallButton from "../../../components/buttons/SmallButton";

const CarouselForm = ({ SelectPageRef, ...props }) => {
  const options = ["fill", "contain", "cover", "none", "scale-down"];

  const { register, watch } = useForm({
    defaultValues: props.defaultValues,
  });

  const [items, setItems] = useState(props.defaultValues.items);
  const defaultItem = "/img-placeholder.jpg";

  const _indicators = watch("indicators");
  const _controls = watch("controls");
  const _fade = watch("fade");
  const _allowPause = watch("allowPause");
  const _objectFit = watch("objectFit");

  const renderImage = (image) => {
    console.log("image", image);
    const removeItem = () => {
      setItems((prev) => {
        console.log("prev", prev);
        let update = prev.filter((img) => img !== image);

        if (!update.length) {
          update = [defaultItem, defaultItem];
        }

        props.handleChange({
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
          style={{
            maxWidth: "118px",
            maxHeight: "118px",
          }}
          alt={image}
          src={image}
        />
      </div>
    );
  };

  return (
    <>
      <form>
        <div>
          <input
            ref={register}
            type="checkbox"
            name="indicators"
            onChange={() =>
              props.handleChange({
                target: {
                  name: "indicators",
                  value: !_indicators,
                },
              })
            }
          />
          <span className="px-2">indicators</span>
        </div>
        <div>
          <input
            ref={register}
            type="checkbox"
            name="controls"
            onChange={() =>
              props.handleChange({
                target: {
                  name: "controls",
                  value: !_controls,
                },
              })
            }
          />
          <span className="px-2">controls</span>
        </div>
        <div>
          <input
            ref={register}
            type="checkbox"
            name="allowPause"
            onChange={() =>
              props.handleChange({
                target: {
                  name: "allowPause",
                  value: !_allowPause,
                },
              })
            }
          />
          <span className="px-2">Pause on hover</span>
        </div>
        <div>
          <input
            ref={register}
            type="checkbox"
            name="fade"
            onChange={() =>
              props.handleChange({
                target: {
                  name: "fade",
                  value: !_fade,
                },
              })
            }
          />
          <span className="px-2">Fade animation</span>
        </div>
        <hr />
        {/*<Select*/}
        {/*  name="objectFit"*/}
        {/*  options={options}*/}
        {/*  ref={register}*/}
        {/*  onChange={(e) =>*/}
        {/*    props.handleChange({*/}
        {/*      target: {*/}
        {/*        name: "objectFit",*/}
        {/*        value: e.target.value,*/}
        {/*      },*/}
        {/*    })*/}
        {/*  }*/}
        {/*/>*/}
      </form>
      <Form {...props}>
        <Select name="objectFit" options={options} />
        <Input name="interval" prepend="in seconds" type="number" />
        <Input name="backgroundColor" />
        {SelectPageRef}
      </Form>
      <hr />
      <label className="form-label">Upload images</label>
      <UploadFileMultiple
        onUploadChange={props.handleChange}
        setItems={setItems}
      />
      <div className="my-2">{items.map(renderImage)}</div>
    </>
  );
};

export default CarouselForm;

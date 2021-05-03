import React, { useState } from "react";
import { Form as BsForm } from "react-bootstrap";
import { Form, Input, Select } from "../../../components/forms/MyForm";
import axios from "axios";
import { getErrorMsg } from "../../../utils/functions";
import { useToastContext } from "../../../providers/ToastProvider";

const ImageForm = ({ SelectPageRef, ...props }) => {
  const { setErrorToast } = useToastContext();

  const [filename, setFilename] = useState("Select local file");

  const options = ["fill", "contain", "cover", "none", "scale-down"];

  const onUploadChange = async (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    if (!file) return;

    setFilename(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          props.handleChange({
            target: {
              name: "src",
              value: res.data.filePath,
            },
          });
        })
        .catch((err) => {
          console.log("err", err);
          setErrorToast(getErrorMsg(err));
        });
    } catch (err) {
      console.log("err", err);
      setErrorToast("Upload failed");
    }
  };

  return (
    <Form {...props}>
      <BsForm.File custom label={filename} onChange={onUploadChange} />
      <br />
      <br />
      <Input label="Image source" name="src" required />
      <Input name="title" />
      <Input name="subtitle" as="textarea" />
      <Select name="objectFit" options={options} />
      <Input name="backgroundColor" />
      {SelectPageRef}
    </Form>
  );
};

export default ImageForm;

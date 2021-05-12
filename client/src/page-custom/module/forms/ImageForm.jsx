import React, { useState } from "react";
import { Form as BsForm } from "react-bootstrap";
import { Form, Input, Select } from "../../../components/forms/MyForm";
import axios from "axios";
import { getErrorMsg } from "../../../utils/functions";
import { useToastContext } from "../../../providers/ToastProvider";
import { URL_PREFIX } from "../../../config";
import ReferenceField from "./ReferenceField";

const ImageForm = React.memo(({ activeModule, handleChange, onSubmit }) => {
  const { setErrorToast } = useToastContext();

  const [filename, setFilename] = useState("Select local file");

  const options = ["fill", "contain", "cover", "none", "scale-down"];

  const onUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilename(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios
        .post(`${URL_PREFIX}/upload`, formData, {
          headers: {
            "Content-Type": "image/*",
          },
        })
        .then((res) => {
          handleChange({
            target: {
              name: "src",
              value: res.data.filePath,
            },
          });
        })
        .catch((err) => {
          setErrorToast(getErrorMsg(err));
        });
    } catch (err) {
      setErrorToast("Upload failed");
    }
  };

  return (
    <Form
      defaultValues={activeModule.body}
      handleChange={handleChange}
      onSubmit={onSubmit}
    >
      <BsForm.File
        custom
        label={filename}
        onChange={onUploadChange}
        className="mb-3"
        accept="image/*"
      />
      <Input label="Image source" name="src" required />
      <Input name="title" />
      <Input name="subtitle" as="textarea" />
      <Select name="objectFit" options={options} />
      <Input name="backgroundColor" />
      <ReferenceField activeModule={activeModule} handleChange={handleChange} />
    </Form>
  );
});

export default ImageForm;

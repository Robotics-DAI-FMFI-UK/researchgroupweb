import React, { useState } from "react";
import { Form as BsForm } from "react-bootstrap";
import axios from "axios";
import { Form, Input } from "../../../components/forms/MyForm";
import { getErrorMsg } from "../../../utils/functions";
import { useToastContext } from "../../../providers/ToastProvider";
import { URL_PREFIX } from "../../../config";

const VideoFrom = ({
  activeModule,
  handleChange,
  onSubmit,
  origin,
  setOrigin,
  isRestored,
}) => {
  const { setErrorToast } = useToastContext();

  const [filename, setFilename] = useState(
    activeModule.body.src || "Select local file"
  );

  const onUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilename(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios
        .post(`${process.env.REACT_APP_URL}/upload`, formData, {
          headers: {
            "Content-Type": "video/*",
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
      origin={origin}
      activeModule={activeModule}
      setOrigin={setOrigin}
      isRestored={isRestored}
    >
      <BsForm.File
        custom
        label={filename}
        onChange={onUploadChange}
        className="mb-3"
        // accept="video/mp4,video/x-m4v,video/*"
      />
      <Input name="title" />
      <Input name="backgroundColor" label="Background color" />
    </Form>
  );
};

export default VideoFrom;

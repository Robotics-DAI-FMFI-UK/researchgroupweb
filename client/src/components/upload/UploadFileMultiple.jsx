import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { URL_PREFIX } from "../../config";
import { useToastContext } from "../../providers/ToastProvider";
import { getErrorMsg } from "../../utils/functions";

const UploadFileMultiple = ({ onUploadChange, setItems }) => {
  const { setErrorToast } = useToastContext();

  const onChange = async (e) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadFiles = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await axios.post(`${URL_PREFIX}/upload`, formData, {
          headers: {
            "Content-Type": "image/*",
          },
        });

        uploadFiles.push(res.data.filePath);
      }

      setItems((prev) => {
        prev = prev.filter((img) => img !== "/img-placeholder.jpg");
        const items = [...prev, ...uploadFiles];

        onUploadChange({
          target: {
            name: "items",
            value: items,
          },
        });

        return items;
      });
    } catch (err) {
      setErrorToast(getErrorMsg(err));
    }
  };

  return (
    <Form.File
      multiple
      onChange={onChange}
      label="Select local file"
      custom
      accept="image/*"
    />
  );
};

export default UploadFileMultiple;

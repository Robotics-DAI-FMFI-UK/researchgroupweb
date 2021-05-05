import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import {URL_PREFIX} from "../../config";

const UploadFileMultiple = ({ onUploadChange, setItems }) => {
  const onChange = async (e) => {
    const files = e.target.files;
    if (!files) return;
    console.log("files", files);

    try {
      const uploadFiles = [];
      for (let i = 0; i < files.length; i++) {
        console.log("file", files[i]);

        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await axios.post(`${URL_PREFIX}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(res);
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
      console.log(err);
    }
  };

  return (
    <>
      <Form.File
        multiple
        onChange={onChange}
        label="Select local file"
        custom
      />
    </>
  );
};

export default UploadFileMultiple;

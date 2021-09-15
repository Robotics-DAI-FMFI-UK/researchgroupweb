import React, { useRef, useState } from "react";
import uuid from "react-uuid";
import axios from "axios";
import { useToastContext } from "../../providers/ToastProvider";
import { getErrorMsg } from "../../utils/functions";
import { URL_PREFIX } from "../../config";

const EditableCell = ({ field, page, setPage }) => {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const [originState] = useState(page[field]);
  const ref = useRef(page[field]);

  const handleChange = (e) => {
    ref.current = e.currentTarget.textContent;
  };

  const submitChange = (e) => {
    const textContent = e.currentTarget.textContent;

    axios
      .patch(`${process.env.REACT_APP_URL}/pages/${page._id}`, {
        [field]: textContent,
      })
      .then((res) => {
        setSuccessToast(`${field} successfully updated`);
        setPage((prev) => {
          return { ...prev, [field]: textContent };
        });
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
        ref.current = originState;
      });
  };

  return (
    <td
      style={{
        maxWidth: "200px",
        wordWrap: "normal",
        overflowX: "auto",
      }}
      key={uuid()}
      id={field}
      onInput={handleChange}
      onBlur={submitChange}
      contentEditable
    >
      {ref.current}
    </td>
  );
};

export default EditableCell;

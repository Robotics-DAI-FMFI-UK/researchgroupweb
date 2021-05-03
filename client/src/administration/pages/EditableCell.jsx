import React, { useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
import axios from "axios";
import { useToastContext } from "../../providers/ToastProvider";
import { getErrorMsg } from "../../utils/functions";

const EditableCell = ({ field, page, setPage }) => {
  const { setErrorToast } = useToastContext();
  const [originState] = useState(page[field]);
  const ref = useRef(page[field]);

  const [refresh, setRefresh] = useState(false);

  const handleChange = (e) => {
    ref.current = e.currentTarget.textContent;
  };

  useEffect(() => {
    if (refresh) setRefresh(false);
  }, [refresh]);

  const submitChange = (e) => {
    const textContent = e.currentTarget.textContent;

    axios
      .patch(`pages/${page._id}`, { [field]: textContent })
      .then((res) => {
        console.log("success", res);
        setPage((prev) => {
          return { ...prev, [field]: textContent };
        });
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
        ref.current = originState;
        setRefresh(true);
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
      {refresh ? originState : ref.current}
    </td>
  );
};

export default EditableCell;

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import uuid from "react-uuid";
import SmallButton from "../../components/buttons/SmallButton";
import axios from "axios";
import EditableCell from "./EditableCell";
import { URL_PREFIX } from "../../config";
import { Link } from "react-router-dom";
import { useToastContext } from "../../providers/ToastProvider";
import { getErrorMsg } from "../../utils/functions";

const PageRow = ({ page: _page, setPages, fields, hasEditPermission }) => {
  const [page, setPage] = useState(_page);
  const { serErrorToast } = useToastContext();

  const editableFields = ["title", "path", "description"];
  const isEditable = (field) => editableFields.includes(field);

  useEffect(() => {
    if (JSON.stringify(_page) === JSON.stringify(page)) return;

    setPages((prev) => prev.map((p) => (p._id !== page._id ? p : page)));
  }, [page]);

  const removePage = () => {
    axios
      .delete(`${URL_PREFIX}/pages/${page._id}`)
      .then((res) => {
        setPages((prev) => prev.filter(({ _id }) => _id !== page._id));
      })
      .catch((err) => {
        if (serErrorToast) serErrorToast(getErrorMsg(err));
      });
  };

  const Toggle = () => {
    const { published } = page;

    const handleChange = () => {
      axios
        .patch(`${URL_PREFIX}/pages/${page._id}`, { published: !published })
        .then((res) => {
          setPage((prev) => {
            return { ...prev, published: !published };
          });
        })
        .catch((err) => {
          serErrorToast(getErrorMsg(err));
        });
    };

    return (
      <Form.Switch
        id={uuid()}
        checked={published}
        label={`${published}`}
        onChange={handleChange}
      />
    );
  };

  const Cell = ({ field }) => {
    let body = page[field];

    if (isEditable(field) && hasEditPermission)
      return <EditableCell field={field} page={page} setPage={setPage} />;

    if (field === "published") {
      body = <Toggle />;
    }
    if (field === "created_by") {
      body = <span>{body?.name || "unknown"}</span>;
    }
    if (field === "export") {
      body = (
        <SmallButton
          id="export"
          variant="outline-primary"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(page, null, 2)
          )}`}
          download="data.json"
        >
          Export
        </SmallButton>
      );
    }
    if (field === "remove") {
      body = (
        <SmallButton id="remove" variant="outline-danger" onClick={removePage}>
          remove
        </SmallButton>
      );
    }
    if (field === "open") {
      body = (
        <SmallButton as={Link} to={page.path} variant="link">
          open
        </SmallButton>
      );
    }

    return (
      <td key={`${field}_${page._id}`} id={`${field}_${page._id}`}>
        {body}
      </td>
    );
  };

  return (
    <tr
      key={page.title}
      style={{
        maxWidth: "200px",
        wordWrap: "normal",
        overflowX: "auto",
      }}
    >
      {fields.map((field) => (
        <Cell field={field} />
      ))}
    </tr>
  );
};

export default PageRow;

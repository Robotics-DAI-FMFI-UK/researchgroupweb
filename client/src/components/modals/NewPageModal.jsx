import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import MyModal from "./MyModal";
import { Form as F } from "react-bootstrap";
import { Error, Form, Input, Submit, Switch } from "../forms/MyForm";
import {
  cloneObj,
  getAuth,
  getErrorMsg,
  upperFirst,
} from "../../utils/functions";
import * as Yup from "yup";
import { URL_PREFIX } from "../../config";
import { usePagesContext } from "../../App";
import uuid from "react-uuid";

const reservedPaths = ["/users", "/profile", "/nav", "/pages"];

const validationSchema = Yup.object({
  path: Yup.string()
    .notOneOf(reservedPaths, "The path name is reserved")
    .matches(/^[/.a-zA-Z0-9-]*$/, "Not valid url path."),
});

const NewPageModal = ({ onHide, page, path, redirect = true }) => {
  const { setPages } = usePagesContext();
  const [error, setError] = useState();

  const [filename, setFilename] = useState("Create from local file");
  const [addedPath, setAddedPath] = useState("");

  const handleSubmit = (data, e) => {
    e.preventDefault();
    console.log("data", data);
    // return;
    let endPoint = `${process.env.REACT_APP_URL}/pages`;

    if (data.copy) {
      endPoint += "/with-layouts";
      data.layouts = page.layouts;
    }

    axios
      .post(endPoint, {
        ...data,
        path: `/${data.path}`,
        created_by: getAuth()?.user.id,
      })
      .then((res) => {
        const { newPage, newModules } = res.data;
        if (onHide && !redirect) onHide();
        setAddedPath(newPage.path);

        setPages((prev) => [
          ...prev,
          {
            ...newPage,
            modules: newModules || [],
            created_by: {
              _id: getAuth().user.id,
              name: getAuth().user.name,
            },
          },
        ]);
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

  const createFromImport = (rawPage) => {
    return axios
      .post("pages", {
        created_by: getAuth()?.user.id,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });

    console.log("IMPORT RAW", rawPage);
    const importedPage = cloneObj(rawPage);
    delete importedPage.modules;

    console.log("IMPORTING PAGE", importedPage);
    // if (!rawPage._id) rawPage._id = objectId()
    return rawPage;
  };

  const updateFromImport = (importData) => {
    axios
      .patch(`${process.env.REACT_APP_URL}/pages/with-grid/${importData._id}`, {
        // columns,
        // modules,
        // removeIds,
      })
      .then((res) => {
        console.log(res);
        // history.push(value.path);
      })
      .catch((err) => {
        setError(getErrorMsg(err));
        console.log(err);
      });
  };

  const onUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilename(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios
        .post(`${process.env.REACT_APP_URL}/pages/import`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          const importData = res.data.readFile;
          console.log("importData", importData);

          if (importData._id) {
            updateFromImport(importData);
          } else {
            createFromImport(importData);
          }
        })
        .catch((err) => {
          console.log("err", err);
          setError(getErrorMsg(err));
        });
    } catch (err) {
      console.log("err", err);
      setError("Upload failed");
    }
  };

  const defaultValues = {
    title: path && upperFirst(path.substr(1)),
    path: path && path.substr(1),
    template: "grid",
  };

  const NewPageForm = () => {
    return (
      <>
        <Form
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          // defaultValues={defaultValues}
        >
          <Input name="title" required defaultValue={defaultValues.title} />
          <Input
            name="path"
            label="url path"
            prepend="/"
            defaultValue={defaultValues.path || ""}
          />
          <Input name="description" as="textarea" />
          {page && (
            <Switch id={uuid()} name="copy" label="copy current page layouts" />
          )}
          <Error error={error} />
          <Submit>Create</Submit>
        </Form>
        <hr />
        <F.File custom label={filename} onChange={onUploadChange} />
        <hr />
      </>
    );
  };

  if (addedPath) {
    console.log("redirect");
    return <Redirect to={addedPath} />;
  }

  return (
    <MyModal
      onHide={onHide}
      size="sm"
      title="Create new page"
      body={<NewPageForm />}
    />
  );
};

export default NewPageModal;

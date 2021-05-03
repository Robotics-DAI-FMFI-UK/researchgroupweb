import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import MyModal from "./MyModal";
import { Form as F } from "react-bootstrap";
import { Error, Form, Input, Select, Submit, Switch } from "../forms/MyForm";
import {
  getAuth,
  getErrorMsg,
  objectId,
  reloadPage,
} from "../../utils/functions";
import { upperFirst, clone } from "lodash";
import * as Yup from "yup";

const reservedPaths = ["/users", "/profile"];

const validationSchema = Yup.object({
  path: Yup.string()
    .notOneOf(reservedPaths, "The path name is reserved")
    .matches(/^[/.a-zA-Z0-9-]+$/, "Not valid url path"),
});

const NewPageModal = ({ onHide, page, path, setPages }) => {
  // const { setPages } = usePagesContext();
  const history = useHistory();
  const [error, setError] = useState();
  const [filename, setFilename] = useState("Create from local file");

  const handleSubmit = (data, e) => {
    e.preventDefault();

    let endPoint = "/pages";

    if (data.copy) {
      endPoint += "/with-layouts";
      data.layouts = page.layouts;
    }

    // return;
    axios
      .post(endPoint, {
        ...data,
        path: "/" + data.path,
        created_by: getAuth()?.user.id,
      })
      .then((res) => {
        if (setPages) {
          setPages((prev) => [
            ...prev,
            {
              ...res.data,
              created_by: {
                _id: getAuth().user.id,
                name: getAuth().user.name,
              },
            },
          ]);
          onHide();
        } else {
          history.push(res.data.path);
          reloadPage();
        }
      })
      .catch((err) => {
        console.log(err);
        setError(getErrorMsg(err));
      });
  };

  const createFromImport = (rawPage) => {
    return axios
      .post("pages", {
        // ...importedPage,
        created_by: getAuth()?.user.id,
      })
      .then((res) => {
        console.log(res);
        // setPages((prev) => [...prev, res.data]);
        history.push(res.data.path);
        reloadPage();
      })
      .catch((err) => {
        console.log(err);
        // setError(getErrorMsg(err));
      });

    console.log("IMPORT RAW", rawPage);
    const importedPage = clone(rawPage);
    delete importedPage.modules;

    console.log("IMPORTING PAGE", importedPage);
    // if (!rawPage._id) rawPage._id = objectId()
    return rawPage;
  };

  const updateFromImport = (importData) => {
    axios
      .patch(`/pages/with-grid/${importData._id}`, {
        // TODO
        // columns,
        // modules,
        // removeIds,
      })
      .then((res) => {
        console.log(res);
        // history.push(value.path);
        reloadPage();
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
        .post("/pages/import", formData, {
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
          defaultValues={defaultValues}
        >
          <Input name="title" required />
          <Input name="path" label="url path" required prepend="/" />
          <Input name="description" as="textarea" />
          {/*<Input name="navbar" disabled />*/}
          {/*<Select name="template" options={["grid", "blog"]} required />*/}
          {page && <Switch name="copy" label="copy current page layouts" />}
          <Error error={error} />
          <Submit>Create</Submit>
        </Form>
        <hr />
        <F.File custom label={filename} onChange={onUploadChange} />
        <hr />
      </>
    );
  };

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

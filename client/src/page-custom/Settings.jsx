import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { Form, Error, Input, Submit, Switch } from "../components/forms/MyForm";
import SmallButton from "../components/buttons/SmallButton";
import { getErrorMsg } from "../utils/functions";
import { useHistory } from "react-router";
import { usePagesContext } from "../App";
import { Redirect } from "react-router-dom";
import uuid from "react-uuid";

const Settings = ({ page, setPage, onHide }) => {
  const [error, setError] = useState();

  const history = useHistory();

  const { setPages } = usePagesContext();
  const [addedPath, setAddedPath] = useState("");

  const onSubmit = (data) => {
    return axios
      .patch(`/pages/${page._id}`, data)
      .then((res) => {
        const updatedPage = { ...page, ...data };

        setPage(updatedPage);

        setPages((prev) => {
          return prev.map((p) => {
            if (p._id !== page._id) return p;
            return updatedPage;
          });
        });

        if (page.path !== data.path) {
          console.log("here");
          setAddedPath(data.path);
          history.push(data.path);
        }

        onHide();
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

  const removePage = () => {
    axios
      .delete(`/pages/${page._id}`)
      .then((res) => {
        setAddedPath(page.path);

        setPages((prev) => {
          return prev.filter((p) => p._id !== page._id);
        });

        setAddedPath(page.path);
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

  const handleChange = () => {
    setPage((prev) => {
      return { ...prev, published: !page.published };
    });
  };

  if (addedPath) {
    return <Redirect to={addedPath} />;
  }

  return (
    <>
      <Modal show={true} onHide={onHide} centered>
        <Modal.Header closeButton className="px-5">
          <Modal.Title>Page settings</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <Form onSubmit={onSubmit} defaultValues={page}>
            <Input name="title" required />
            <Input name="path" required />
            <Input name="description" />
            <Switch
              id={uuid()}
              name="published"
              checked={page.published}
              onChange={handleChange}
            />
            <Error error={error} />
            <Submit>save</Submit>
          </Form>
        </Modal.Body>
        <Modal.Footer className="px-5">
          <p className="d-flex mr-auto">Author: {page.created_by.name}</p>
          <SmallButton variant="outline-danger" onClick={removePage}>
            remove
          </SmallButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;

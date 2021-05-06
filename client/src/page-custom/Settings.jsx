import React, { useState } from "react";
import axios from "axios";
import {
  Form as F,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from "react-bootstrap";
import { Error, Submit } from "../components/forms/MyForm";
import SmallButton from "../components/buttons/SmallButton";
import { getErrorMsg } from "../utils/functions";
import JsonModal from "../components/modals/JsonModal";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import { usePagesContext } from "../App";
import { Redirect } from "react-router-dom";

const Settings = ({ page, setPage, onHide }) => {
  const [error, setError] = useState();

  const { register, handleSubmit } = useForm({
    defaultValues: page,
  });

  const history = useHistory();
  const [published, setPublished] = useState(page.published);

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const { setPages } = usePagesContext();
  const [addedPath, setAddedPath] = useState("");

  const onSubmit = (data) => {
    console.log(data);
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
          setAddedPath(data.path);
          history.push(data.path);
        }
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
          <F onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <FormLabel>Title</FormLabel>
              <FormControl
                type="text"
                name="title"
                placeholder="Enter title"
                ref={register}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Path</FormLabel>
              <FormControl
                type="text"
                name="path"
                placeholder="Enter path"
                ref={register}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                name="description"
                placeholder="Enter description"
                ref={register}
              />
            </FormGroup>

            <FormGroup>
              <F.Switch
                name="published"
                label="published"
                value={published}
                onClick={() => setPublished((prev) => !prev)}
              />
            </FormGroup>

            <Error error={error} />
            <Submit>save</Submit>
          </F>
        </Modal.Body>
        <Modal.Footer className="px-5">
          <p className="d-flex mr-auto">Author: {page.created_by.name}</p>
          <SmallButton variant="outline-danger" onClick={removePage}>
            remove
          </SmallButton>
          {/*<SmallButton variant="outline-primary" onClick={toggleModal}>*/}
          {/*  JSON*/}
          {/*</SmallButton>*/}
        </Modal.Footer>
      </Modal>
      {showModal && <JsonModal onHide={toggleModal} page={page} />}
    </>
  );
};

export default Settings;

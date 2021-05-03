import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Form as F,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from "react-bootstrap";
import { Error, Input, Submit, Switch } from "../components/forms/MyForm";
import SmallButton from "../components/buttons/SmallButton";
import { getErrorMsg, reloadPage } from "../utils/functions";
import JsonModal from "../components/modals/JsonModal";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import { upperFirst } from "lodash";

const Settings = ({ page, setPage, onHide }) => {
  const [error, setError] = useState();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: page,
  });

  const history = useHistory();
  const [published, setPublished] = useState(page.published);

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const onSubmit = (data) => {
    console.log(data);
    return axios
      .patch(`/pages/${page._id}`, data)
      .then((res) => {
        setPage((prev) => {
          return { ...prev, ...data };
        });

        if (page.path !== data.path) {
          history.push(data.path);
          reloadPage();
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
        reloadPage();
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

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

                // ref={register}
                // onClick={(formState.published = !formState.published)}
                // checked={formState.published}
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
          <SmallButton variant="outline-primary" onClick={toggleModal}>
            JSON
          </SmallButton>
        </Modal.Footer>
      </Modal>
      {showModal && <JsonModal onHide={toggleModal} page={page} />}
    </>
  );
};

export default Settings;

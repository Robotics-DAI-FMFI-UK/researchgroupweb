import React, { useState } from "react";
import axios from "axios";
import {
  setAuth,
  reloadPage,
  getErrorMsg,
  upperFirst,
} from "../utils/functions";
import LoginForm from "./forms/LoginForm.jsx";
import RegisterForm from "./forms/RegisterForm";
import { Modal } from "react-bootstrap";
import { URL_PREFIX } from "../config";

/** action: "login" or "register" */
const AuthModal = ({ action, onHide, setUsers }) => {
  const [authError, setAuthError] = useState();
  const [show, setShow] = useState(true);
  const fallback = () => setShow(false);

  const handleSubmit = (data) => {
    console.log(data);
    axios
      .post(`${URL_PREFIX}/auth/${action}`, data)
      .then((res) => {
        if (action === "login") {
          setAuth(res.data);
          reloadPage();
        } else {
          setUsers((prev) => [
            ...prev,
            {
              ...res.data.user,
              _id: res.data.user.id,
            },
          ]);
          onHide();
        }
      })
      .catch((err) => {
        setAuthError(getErrorMsg(err));
      });
  };

  const props = { handleSubmit, authError };
  const title = `${upperFirst(action)} form`;

  return (
    <Modal show={show} onHide={onHide || fallback} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center mx-0">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action === "login" ? (
          <LoginForm {...props} />
        ) : (
          <RegisterForm {...props} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;

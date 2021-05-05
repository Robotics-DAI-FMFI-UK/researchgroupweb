import React from "react";
import { Modal } from "react-bootstrap";
import AuthModal from "../../authorization/AuthModal";
import { getAuth } from "../../utils/functions";
import NavActionBtns from "../NavActionBtns";

const UserModal = ({ onHide, showModal }) => {
  const user = getAuth()?.user;

  const style = {
    marginTop: "2.4em",
    width: "15%",
    minWidth: "300px",
    right: "5px",
    left: "unset"
  };

  const LoginUser = () => (
    <Modal show={showModal} onHide={onHide} style={style} backdropClassName="user-modal" className="d-none d-lg-block">
      <Modal.Body style={{
        backgroundColor: "#eee",
        boxShadow: "3px 3px 10px 0px gray"
      }}>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <NavActionBtns onHide={onHide}/>
      </Modal.Body>
    </Modal>
  );

  return <>{user ? <LoginUser /> : <AuthModal action="login" />}</>;
};

export default UserModal;

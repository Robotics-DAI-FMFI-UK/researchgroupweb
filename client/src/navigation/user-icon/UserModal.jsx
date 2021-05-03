import React from "react";
import { Modal } from "react-bootstrap";
import {
  BsPersonLinesFill,
  BsPeopleFill,
  BsBoxArrowRight,
  BsFiles,
} from "react-icons/bs";
import { IconContext } from "react-icons";
import AuthModal from "../../authorization/AuthModal";
import { delAuth, getAuth, reloadPage } from "../../utils/functions";
import SmallButton from "../../components/buttons/SmallButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const UserModal = ({ onHide }) => {
  const user = getAuth()?.user;

  const style = {
    marginTop: "2.4em",
    position: "fix",
    width: "15%",
    minWidth: "300px",
    left: "85%",
  };

  const logout = () => {
    delAuth();
    reloadPage();
  };

  const LoginUser = () => (
    <Modal show={true} onHide={onHide} style={style}>
      <Modal.Body>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <IconContext.Provider value={{ size: "20", color: "white" }}>
          <ButtonGroup className="w-100">
            <SmallButton href="/pages" title="pages">
              <BsFiles />
            </SmallButton>
            {/*{user.admin && (*/}
            <SmallButton href="/users" title="users">
              <BsPeopleFill />
            </SmallButton>
            {/*)}*/}
            <SmallButton href="/profile" title="profile">
              <BsPersonLinesFill />
            </SmallButton>
            <SmallButton onClick={logout} title="logout">
              <BsBoxArrowRight />
            </SmallButton>
          </ButtonGroup>
        </IconContext.Provider>
      </Modal.Body>
    </Modal>
  );

  return <>{user ? <LoginUser /> : <AuthModal action="login" />}</>;
};

export default UserModal;

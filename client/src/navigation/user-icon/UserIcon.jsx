import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import UserModal from "./UserModal";
import { BiLogIn } from "react-icons/bi";
import NavActionBtns from "../NavActionBtns";

export const UserIcon = ({ auth }) => {
  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const LogoutIcon = () => {
    return (
      <div className="text-center" onClick={toggleModal}>
        <BiLogIn className="login-btn" title="login" />
      </div>
    );
  };

  const LoggedIcon = () => {
    return (
      <>
        <div
          className="d-none d-lg-block"
          dataBackdrop="false"
          onClick={toggleModal}
        >
          <Image
            src={`/defaultAvatar.png`}
            rounded
            className="p-1"
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        </div>
        <div className="d-lg-none">
          <NavActionBtns />
        </div>
      </>
    );
  };

  return (
    <div>
      {auth ? <LoggedIcon /> : <LogoutIcon />}
      {showModal && <UserModal onHide={toggleModal} showModal={showModal} />}
    </div>
  );
};

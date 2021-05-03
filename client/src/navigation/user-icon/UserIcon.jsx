import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import UserModal from "./UserModal";
import { getAuth } from "../../utils/functions";

export const UserIcon = () => {
  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const avatar = getAuth()?.user.avatar;

  const userImage = "/" + (avatar || "login") + ".png";

  return (
    <div>
      <Image
        src={userImage}
        rounded
        onClick={toggleModal}
        className={"p-1"}
        style={{
          width: "40px",
          height: "40px",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
        }}
      />
      {showModal && <UserModal onHide={toggleModal} />}
    </div>
  );
};

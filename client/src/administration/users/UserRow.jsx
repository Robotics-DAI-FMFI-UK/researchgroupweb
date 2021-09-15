import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import { formatDate, getAuth, getErrorMsg } from "../../utils/functions";
import axios from "axios";
import { Form } from "react-bootstrap";
import uuid from "react-uuid";
import NewPageModal from "../../components/modals/NewPageModal";
import SmallButton from "../../components/buttons/SmallButton";
import { URL_PREFIX } from "../../config";
import { useToastContext } from "../../providers/ToastProvider";

const UserRow = ({ user: _user, setUsers, fields }) => {
  const [user, setUser] = useState(_user);
  const { isAdmin } = user;

  const { serErrorToast } = useToastContext();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prev) => !prev);

  const Toggle = () => {
    const handleChange = () => {
      axios
        .patch(`${process.env.REACT_APP_URL}/users/${user._id}`, {
          isAdmin: !isAdmin,
        })
        .then((res) => {
          setUser((prev) => {
            return { ...prev, isAdmin: !isAdmin };
          });
        })
        .catch((err) => {
          serErrorToast(getErrorMsg(err));
        });
    };

    return (
      <Form.Switch
        id={uuid()}
        checked={isAdmin}
        label={`${isAdmin}`}
        disabled={!getAuth()?.user.isAdmin}
        onChange={handleChange}
      />
    );
  };

  const removePage = () => {
    axios
      .delete(`${process.env.REACT_APP_URL}/users/${user._id}`)
      .then((res) => {
        setUsers((prev) => prev.filter(({ _id }) => _id !== user._id));
      })
      .catch((err) => {
        serErrorToast(getErrorMsg(err));
      });
  };

  const Cell = ({ field }) => {
    let body = user[field];

    if (field === "pages") {
      body = (
        <SmallButton variant="outline-primary" onClick={toggleModal} disabled>
          pages
        </SmallButton>
      );
    }
    if (field === "isAdmin") body = <Toggle />;
    if (field === "avatar")
      body = (
        <Image
          // alt="avatar"
          src={`/${user.avatar}.png`}
          width="30"
          height="30"
        />
      );
    if (field === "register_date") body = <p>{formatDate(body)}</p>;
    if (field === "remove") {
      body = (
        <SmallButton id="remove" variant="outline-danger" onClick={removePage}>
          remove
        </SmallButton>
      );
    }

    return <td key={field}>{body}</td>;
  };

  return (
    <>
      <tr key={user._id}>
        {fields.map((field) => (
          <Cell field={field} />
        ))}
      </tr>
      {showModal && <NewPageModal onHide={toggleModal} />}
    </>
  );
};

export default UserRow;

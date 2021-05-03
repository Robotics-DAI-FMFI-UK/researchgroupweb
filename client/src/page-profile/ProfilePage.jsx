import React, { useEffect, useState } from "react";
import axios from "axios";
import { ButtonGroup, Button, Container } from "react-bootstrap";
import ImageEditor from "./ImageEditor";
import UserInfoForm from "./forms/UserInfoForm";
import UserPassForm from "./forms/UserPassForm";
import { getAuth, setAuth, tokenConfig } from "../utils/functions";
import SmallButton from "../components/buttons/SmallButton";
import { useToastContext } from "../providers/ToastProvider";

const ProfilePage = () => {
  const [form, setForm] = useState("profile");
  const [error, setError] = useState();
  const { setSuccessToast } = useToastContext();

  const auth = getAuth();
  const user = auth.user;

  const changeForm = (e) => {
    setError(null);
    setForm(e.target.id);
  };

  const saveProfile = (data) => {
    onSubmit("/users", data).then((res) => {
      if (res.ok) {
        setAuth({ ...auth, user: { ...user, ...data } });
      }
    });
  };

  const savePassword = (data) => {
    onSubmit("/users/password", data).then();
  };

  const saveImage = (image) => {
    onSubmit("/users", { avatar: image }).then((res) => {
      if (res.ok) {
        setAuth({ ...auth, user: { ...user, avatar: image } });
      }
    });
  };

  const onSubmit = (url, data) => {
    console.log("submit", data);
    return axios
      .patch(`${url}/${user.id}`, data)
      .then((res) => {
        console.log(res);
        setError(null);
        setSuccessToast("Update succeed");
        return {
          ok: true,
          data: res,
        };
      })
      .catch((err) => {
        setError(err.response.data.message);
        return {
          ok: false,
          data: err,
        };
      });
  };

  const props = {
    defaultValues: user,
    onSubmit: form === "profile" ? saveProfile : savePassword,
    error,
  };

  const active = (id) => (form === id ? "active" : "");

  return (
    <Container className="d-flex align-items-end justify-content-center mt-5">
      {/*<ImageEditor src={user?.avatar} saveImage={saveImage} />*/}
      <div>
        <h1>Profile settings</h1>
        <ButtonGroup className="my-3 btn-block" onClick={changeForm}>
          <SmallButton id="profile" className={active("profile")}>
            Change name
          </SmallButton>
          <SmallButton id="passwd" className={active("passwd")}>
            Change pass
          </SmallButton>
        </ButtonGroup>
        {form === "profile" ? (
          <UserInfoForm {...props} />
        ) : (
          <UserPassForm {...props} />
        )}
      </div>
    </Container>
  );
};

export default ProfilePage;

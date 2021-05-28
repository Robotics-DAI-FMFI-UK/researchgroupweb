import React, { useState } from "react";
import axios from "axios";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import UserPassForm from "./forms/UserPassForm";
import { getAuth, getErrorMsg, setAuth } from "../utils/functions";
import SmallButton from "../components/buttons/SmallButton";
import { useToastContext } from "../providers/ToastProvider";
import { URL_PREFIX } from "../config";
import UserInfoForm from "./forms/UserInfoForm";

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
    onSubmit("users", data).then((res) => {
      if (res.ok) setAuth({ ...auth, user: { ...user, ...data } });
    });
  };

  const savePassword = (data) => {
    onSubmit("users/password", data).then();
  };

  const onSubmit = (url, data) => {
    return axios
      .patch(`${URL_PREFIX}/${url}/${user.id}`, data)
      .then((res) => {
        setError(null);
        setSuccessToast("Update succeed");
        return {
          ok: true,
          data: res,
        };
      })
      .catch((err) => {
        setError(getErrorMsg(err));
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
    <div className="d-flex align-items-end justify-content-center mt-5">
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
    </div>
  );
};

export default ProfilePage;

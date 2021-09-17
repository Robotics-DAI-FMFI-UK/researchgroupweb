import React, { useEffect, useState } from "react";
import axios from "axios";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AlertForm from "./AlertForm";
import CarouselForm from "./CarouselForm";
import HtmlForm from "./HtmlForm";
import ImageForm from "./ImageForm";
import SmallButton from "../../../components/buttons/SmallButton";
import { useToastContext } from "../../../providers/ToastProvider";
import { getErrorMsg, upperFirst } from "../../../utils/functions";
import { URL_PREFIX } from "../../../config";
import VideoForm from "./VideoForm";

const moduleFactory = (activeModule) => {
  if (activeModule.type === "carousel") {
    return CarouselForm;
  }
  if (activeModule.type === "alert") {
    return AlertForm;
  }
  if (activeModule.type === "html") {
    return HtmlForm;
  }
  if (activeModule.type === "video") {
    return VideoForm;
  }
  if (activeModule.type === "image") {
    return ImageForm;
  }
  return null;
};

const EditForm = ({ activeModule, updateActiveModule, closeActiveModule }) => {
  const { setSuccessToast, setErrorToast } = useToastContext();

  const [isRestored, setIsRestored] = useState(false);
  const [origin, setOrigin] = useState(activeModule);
  const resetActiveModule = () => {
    setIsRestored(true);
    updateActiveModule(origin);
  };

  const handleChange = (e) => {
    setIsRestored(false);

    const { name, value } = e.target;
    updateActiveModule({
      ...activeModule,
      body: { ...activeModule.body, [name]: value },
    });
  };

  const onSubmit = () => {
    axios
      .patch(`${process.env.REACT_APP_URL}/modules/${activeModule._id}`, {
        body: activeModule.body,
      })
      .then((res) => {
        setSuccessToast("Module saved successfully");
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
      });
  };

  const ModuleForm = moduleFactory(activeModule);

  if (!ModuleForm) {
    return (
      <div className="m-4">
        <h1 className="text-center">{upperFirst(activeModule.type)}</h1>
        <h4 className="text-center">Form not found</h4>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h1 className="text-center">{upperFirst(activeModule.type)}</h1>
      <hr />
      {/*{activeModule.type === "alert" && <AlertForm {...props} />}*/}
      <ModuleForm
        activeModule={activeModule}
        handleChange={handleChange}
        onSubmit={onSubmit}
        origin={origin}
        setOrigin={setOrigin}
        isRestored={isRestored}
      />
      <ButtonGroup className="space-children w-100">
        <SmallButton className="ml-0" onClick={closeActiveModule}>
          close
        </SmallButton>
        <SmallButton className="mr-0" onClick={resetActiveModule}>
          reset
        </SmallButton>
      </ButtonGroup>
    </div>
  );
};

export default EditForm;

import React, { useState } from "react";
import axios from "axios";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AlertForm from "./AlertForm";
import CarouselForm from "./CarouselForm";
import HtmlForm from "./HtmlForm";
import ImageForm from "./ImageForm";
import { useActiveModuleContext } from "../../ActiveModuleProvider";
import SmallButton from "../../../components/buttons/SmallButton";
import { useToastContext } from "../../../providers/ToastProvider";
import { getErrorMsg, upperFirst } from "../../../utils/functions";
import { URL_PREFIX } from "../../../config";
import VideoForm from "./VideoForm";

const EditForm = () => {
  const { setSuccessToast, setErrorToast } = useToastContext();

  const {
    activeModule,
    updateActiveModule,
    closeActiveModule,
  } = useActiveModuleContext();

  const [origin] = useState(activeModule);
  const resetActiveModule = () => updateActiveModule(origin);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateActiveModule({
      ...activeModule,
      body: { ...activeModule.body, [name]: value },
    });
  };

  const onSubmit = () => {
    axios
      .patch(`${URL_PREFIX}/modules/${activeModule._id}`, {
        body: activeModule.body,
      })
      .then((res) => {
        setSuccessToast("Module saved successfully");
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
      });
  };

  const props = {
    activeModule,
    handleChange,
    onSubmit,
  };

  const ModuleForm = formFactory(activeModule);

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
      <ModuleForm {...props} />
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

const formFactory = (activeModule) => {
  switch (activeModule.type) {
    case "alert":
      return AlertForm;
    case "carousel":
      return CarouselForm;
    case "html":
      return HtmlForm;
    case "image":
      return ImageForm;
    case "video":
      return VideoForm;
    default:
      return null;
  }
};

export default EditForm;

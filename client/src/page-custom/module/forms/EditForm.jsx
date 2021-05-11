import React, { useState } from "react";
import axios from "axios";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AlertForm from "./AlertForm";
import CarouselForm from "./CarouselForm";
import HtmlForm from "./HtmlForm";
import ImageForm from "./ImageForm";
import SmallButton from "../../../components/buttons/SmallButton";
import { useToastContext } from "../../../providers/ToastProvider";
import { getErrorMsg, upperFirst } from "../../../utils/functions";
import { usePagesContext } from "../../../App";
import CreatableSelect from "react-select/creatable";
import { useActiveModuleContext } from "../../ActiveModuleProvider";
import { URL_PREFIX } from "../../../config";

const EditForm = ({ activeModule }) => {
  const { pages } = usePagesContext();
  const { setSuccessToast, setErrorToast } = useToastContext();
  const { updateActiveModule, closeActiveModule } = useActiveModuleContext();
  const [origin] = useState(activeModule);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateActiveModule({
      ...activeModule,
      body: { ...activeModule.body, [name]: value },
    });
  };

  const reset = () => {
    updateActiveModule(origin);
  };

  const onSubmit = (data) => {
    axios
      .patch(`${URL_PREFIX}/modules/${activeModule._id}`, {
        body: activeModule.body,
      })
      .then((res) => {
        setSuccessToast("Module saved successfully");
        console.log(res);
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
        console.log(err);
      });
  };

  const props = {
    defaultValues: activeModule?.body,
    handleChange,
    onSubmit,
  };

  const options = pages.map((page) => {
    return { value: page._id, label: page.title };
  });

  const defaultSelected = () => {
    const reference = activeModule?.body?.reference;
    if (!reference) return;

    const isExternalRef = reference.substr(0, 5) === "https";
    if (isExternalRef) {
      return {
        value: reference,
        label: reference, //.substr(8),
      };
    }

    const refPage = options.find(
      (ref) => ref.value === activeModule.body.reference
    );

    if (!refPage) return;
    return {
      value: refPage._id,
      label: refPage.label,
    };
  };
  const selectOption = (option) => {
    console.log("ee", option);
    setSelected(option);
    props.handleChange({
      target: {
        name: "reference",
        value: option.value,
      },
    });
  };

  const [selected, setSelected] = useState(defaultSelected());

  props.SelectPageRef = (
    <div style={{ marginBottom: "16px" }}>
      <hr />
      <label className="form-label">Page reference</label>
      <CreatableSelect
        menuContainerStyle={{ top: "auto", bottom: "100%" }}
        isClearable
        value={selected}
        onChange={selectOption}
        options={options}
      />
    </div>
  );

  if (!activeModule) return null;

  const ModuleForm = moduleFactory(activeModule);

  return (
    <div className="m-4">
      <h1 className="text-center">{upperFirst(activeModule.type)}</h1>
      <hr />
      <ModuleForm {...props} />
      <ButtonGroup className="space-children w-100">
        <SmallButton className="ml-0" onClick={closeActiveModule}>
          close
        </SmallButton>
        <SmallButton className="mr-0" onClick={reset}>
          reset
        </SmallButton>
      </ButtonGroup>
    </div>
  );
};

const moduleFactory = (activeModule) => {
  switch (activeModule.type) {
    case "alert":
      return AlertForm;
    case "carousel":
      return CarouselForm;
    case "html":
      return HtmlForm;
    case "image":
      return ImageForm;
    default:
      return null;
  }
};

export default EditForm;

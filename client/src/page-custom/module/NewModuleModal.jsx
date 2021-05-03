import React, { useState } from "react";
import MyModal from "../../components/modals/MyModal";
import {
  Error,
  Form,
  Input,
  Select,
  Submit,
} from "../../components/forms/MyForm";
import axios from "axios";
import { getErrorMsg } from "../../utils/functions";
import { useForm } from "react-hook-form";
import { Form as F, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { upperFirst } from "lodash";
import SmallButton from "../../components/buttons/SmallButton";

const NewModuleModal = ({ modules, addNewModule, toggleModal }) => {
  const [error, setError] = useState();
  const [hardCopy, setHardCopy] = useState(false);
  const toggleHardCopy = () => setHardCopy((prev) => !prev);

  const createType = (e) => {
    addNewModule({ type: e.target.value });
    toggleModal();
  };

  const createCopy = async () => {
    let _id = await navigator.clipboard.readText();
    _id = _id.replaceAll('"', "");

    const localModule = modules.find((m) => m._id === _id);

    if (localModule) {
      if (hardCopy) {
        setError("Cannot create hard copy, module is already at the page");
        return;
      }
      addNewModule(localModule, hardCopy);
      toggleModal();
      return;
    }

    // find in db
    axios
      .get(`/modules/${_id}`)
      .then((res) => {
        addNewModule(res.data, hardCopy);
        toggleModal();
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

  const options = ["alert", "carousel", "editor-js", "html", "image"];

  const Delimiter = () => {
    return (
      <>
        <hr />
        <p className="pl-5">
          <em>or</em>
        </p>
        <hr />
      </>
    );
  };

  const ModuleForm = () => {
    return (
      <>
        {/* SELECT TYPE */}
        <FormGroup>
          <FormControl as="select" onChange={createType}>
            <>
              <option hidden value="">
                Select type to create empty module
              </option>
              {options.map((value, i) => (
                <option key={`${value}_${i}`} value={value}>
                  {value}
                </option>
              ))}
            </>
          </FormControl>
        </FormGroup>
        <Delimiter />
        {/* SELECT COPY */}
        <SmallButton
          className="btn-block p-2 mb-2 pl-3 text-left"
          onClick={createCopy}
        >
          Click to paste id of module from clipboard
        </SmallButton>
        <FormGroup>
          <F.Check
            checked={hardCopy}
            onChange={toggleHardCopy}
            label={"hard copy of module (with same id)"}
            type="checkbox"
          />
        </FormGroup>
        <Error error={error} />
      </>
    );
  };

  return (
    <MyModal onHide={toggleModal} title="New Module" body={<ModuleForm />} />
  );
};

export default NewModuleModal;

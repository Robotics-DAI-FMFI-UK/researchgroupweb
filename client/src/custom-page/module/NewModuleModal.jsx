import React, { useState } from "react";
import axios from "axios";
import { getErrorMsg } from "../../utils/functions";
import { Form as F, FormControl, FormGroup } from "react-bootstrap";
import SmallButton from "../../components/buttons/SmallButton";
import { URL_PREFIX } from "../../config";
import { BsExclamationTriangle } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";

const NewModuleModal = ({ showModal, modules, addNewModule, toggleModal }) => {
  const [error, setError] = useState();
  const [hardCopy, setHardCopy] = useState(false);
  const toggleHardCopy = () => setHardCopy((prev) => !prev);

  const createType = (e) => {
    addNewModule({ type: e.target.value });
    toggleModal();
  };

  const createCopy = async () => {
    let _id = await navigator.clipboard.readText();

    if (!_id) {
      setError("Your clipboard is empty");
      return;
    }

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
      .get(`${URL_PREFIX}/modules/${_id}`)
      .then((res) => {
        addNewModule(res.data, hardCopy);
        toggleModal();
      })
      .catch((err) => {
        setError(getErrorMsg(err));
      });
  };

  const options = ["alert", "carousel", "editor-js", "html", "image", "video"];

  const Delimiter = () => {
    return (
      <>
        <hr />
        <p className="pl-5">
          {error ? (
            <span style={{ color: "red" }}>
              <BsExclamationTriangle /> {error}
            </span>
          ) : (
            <em>or</em>
          )}
        </p>
        <hr />
      </>
    );
  };

  return (
    <Modal show={showModal} centered onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>New Module</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        <FormGroup>
          <F.Check
            checked={hardCopy}
            onChange={toggleHardCopy}
            label={"hard copy of module (with same id)"}
            type="checkbox"
          />
        </FormGroup>
        <SmallButton
          className="btn-block p-2 mb-2 pl-3 text-left"
          onClick={createCopy}
        >
          Click to paste id of module from clipboard
        </SmallButton>
      </Modal.Body>
    </Modal>
  );
};

export default NewModuleModal;

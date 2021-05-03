import React from "react";
import Modal from "react-bootstrap/Modal";
import SmallButton from "../buttons/SmallButton";
import { BiClipboard } from "react-icons/bi";

const JsonModal = ({ onHide, page }) => {
  const jsonData = JSON.stringify(page.columns, null, 2);

  const copyPageToClipboard = () => {
    navigator.clipboard.writeText(jsonData).then(() => onHide());
  };

  return (
    <>
      <Modal show={true} onHide={onHide} centered>
        <Modal.Header closeButton className="px-5">
          <Modal.Title>Page's json data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="overflow-auto w-100">{jsonData}</div>
        </Modal.Body>
        <Modal.Footer className="px-5">
          <SmallButton variant="link" title="copy to clipboard">
            <BiClipboard size="25" onClick={copyPageToClipboard} />
          </SmallButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JsonModal;

import React from "react";
import Modal from "react-bootstrap/Modal";

const MyModal = ({ title, body, footer, ...rest }) => {
  return (
    <Modal show={true} centered {...rest}>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      {body && <Modal.Body>{body}</Modal.Body>}
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export default MyModal;

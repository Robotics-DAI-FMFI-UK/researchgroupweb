import React, { useState } from "react";
import { Image, Navbar } from "react-bootstrap";
import { Form, Input, Submit } from "../components/forms/MyForm";
import MyModal from "../components/modals/MyModal";
import UploadFile from "../components/upload/UploadFile";
import { useModeContext } from "../providers/ModeProvider";
import { useHistory } from "react-router";

const NavBrand = () => {
  // const [editMode] = useModeContext();
  const history = useHistory();

  const [imageSource, setImageSource] = useState("/logo.png");
  // const [showModal, setShowModal] = useState(false);
  // const toggleModal = () => setShowModal((prev) => !prev);

  const handleClick = (e) => {
    // if (editMode) {
    //   toggleModal();
    // } else {
    history.push("/");
    // }
  };

  // const handleSubmit = (data) => {};

  // const onMouseEnter = () => editMode && !e.ctrlKey && setImageSource("/edit.png");
  // const onMouseLeave = () => setImageSource("/logo.png");

  // const NavBrandModal = () => (
  //   <MyModal
  //     onHide={toggleModal}
  //     size="sm"
  //     title="Brand settings"
  //     body={
  //       <Form onSubmit={handleSubmit}>
  //         <Input name="path" label="Redirect to" defaultValue="/" />
  //         <Input name="source" label="Linked custom-image" />
  //         Upload custom-image
  //         <UploadFileMultiple />
  //         <Submit>save</Submit>
  //       </Form>
  //     }
  //   />
  // );

  return (
    <>
      <Navbar.Brand
        onClick={handleClick}
        className="mr-0 mr-lg-2"
        style={{ position: "absolute", top: "5px" }}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
      >
        <Image alt="logo" src={imageSource} width="80" height="80" />
      </Navbar.Brand>
      {/*{showModal && <NavBrandModal />}*/}
    </>
  );
};

export default NavBrand;

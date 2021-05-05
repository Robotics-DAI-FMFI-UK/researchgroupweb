import React from "react";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import { useHistory } from "react-router";

const NavBrand = () => {
  const history = useHistory();

  return (
    <>
      <Navbar.Brand
        onClick={() => history.push("/")}
        className="mr-0 mr-lg-2"
        style={{ position: "absolute", left: "5px", top: "0px" }}
      >
        <Image
          alt="logo"
          className="img-logo"
          src="/logo.png"
          width="90"
          height="90"
        />
      </Navbar.Brand>
    </>
  );
};

export default NavBrand;

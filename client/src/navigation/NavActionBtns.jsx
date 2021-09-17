import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "../components/buttons/SmallButton";
import { Link } from "react-router-dom";
import { BsFiles, BsPeopleFill, BsPersonLinesFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { IconContext } from "react-icons";
import { useAuthContext } from "../providers/AuthProvider";

const NavActionBtns = ({ onHide }) => {
  const { loggOut } = useAuthContext();

  const logout = () => {
    loggOut();
    onHide();
  };

  const handleClick = () => {
    if (onHide) onHide();
  };

  return (
    <IconContext.Provider value={{ size: "20", color: "white" }}>
      <ButtonGroup className="w-100">
        <SmallButton
          onClick={() => handleClick()}
          as={Link}
          to="/pages"
          title="pages"
        >
          <BsFiles />
        </SmallButton>
        {/*{user.admin && (*/}
        <SmallButton
          onClick={() => handleClick()}
          as={Link}
          to="/users"
          title="users"
        >
          <BsPeopleFill />
        </SmallButton>
        {/*)}*/}
        <SmallButton
          onClick={() => handleClick()}
          as={Link}
          to="/profile"
          title="profile"
        >
          <BsPersonLinesFill />
        </SmallButton>
        <SmallButton onClick={logout} title="logout">
          <BiLogOut style={{ transform: "scaleX(-1)" }} />
        </SmallButton>
      </ButtonGroup>
    </IconContext.Provider>
  );
};

export default NavActionBtns;

import React, { useState } from "react";
import EditForm from "./module/forms/EditForm";
import { useModeContext } from "../providers/ModeProvider";
import { BsArrowLeftRight } from "react-icons/bs";
import SmallButton from "../components/buttons/SmallButton";
import { useActiveModuleContext } from "./ActiveModuleProvider";

const Sidebar = () => {
  const [editMode] = useModeContext();
  const { activeModule } = useActiveModuleContext();

  const [side, setSide] = useState("right");
  const oppositeSide = side === "right" ? "left" : "right";

  const openSidebar =
    editMode && activeModule && activeModule.type !== "editor-js";

  const style = {
    position: "fixed",
    top: "0px",
    paddingTop: "66px",
    right: side === "right" ? "0" : "",
    left: side === "left" ? "0" : "",
    width: openSidebar ? "300px" : "0",
    minHeight: "100vh",
    transition: "ease .3s",
    backgroundColor: "#eee",
    zIndex: "999",
    // overflowY: "auto",
    boxShadow: `${side === "right" ? "-" : ""}5px 0 10px #1C1C1C`,
  };

  const swapPosition = () => setSide(oppositeSide);

  return (
    <div style={style}>
      {openSidebar ? (
        <>
          <SmallButton
            onClick={swapPosition}
            variant="link"
            title={`swap to ${oppositeSide}`}
            className="position-absolute ml-2"
          >
            <BsArrowLeftRight size="25" />
          </SmallButton>
          <EditForm activeModule={activeModule} />
        </>
      ) : null}
    </div>
  );
};

export default Sidebar;

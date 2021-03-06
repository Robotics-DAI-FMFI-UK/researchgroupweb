import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "../../components/buttons/SmallButton";
import { IconContext } from "react-icons";
import { BiClipboard } from "react-icons/bi";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
  RiPushpin2Fill,
  RiPushpin2Line,
  RiDragMove2Fill,
} from "react-icons/ri";

const ModuleToolbar = ({
  module,
  position,
  onPin,
  onRemove,
  onShrink,
  showToolbar,
  copyCardToClipboard,
  createCardCopy,
  toggleActiveModule,
}) => {
  const isPinned = position.static;

  const style = {
    position: "absolute",
    top: "-30px",
    left: "0",
    zIndex: "101",
    width: "100%",
  };

  const styleDragButton = {
    backgroundColor: "#343a40",
    paddingTop: ".25rem",
    paddingBottom: ".25rem",
    marginLeft: ".5rem",
    marginRight: ".5rem",
    cursor: isPinned ? "not-allowed" : "grab",
  };

  return (
    <div style={style}>
      {showToolbar && (
        <ButtonGroup
          className="w-100"
          style={{
            backgroundColor: "#343a40",
          }}
        >
          <IconContext.Provider value={{ size: "20", color: "white" }}>
            {/*<SmallButton onClick={onShrink}>S</SmallButton>*/}
            <SmallButton
              onClick={() => toggleActiveModule(module)}
              title="edit"
            >
              <BsPencil />
            </SmallButton>
            <SmallButton
              onClick={() => copyCardToClipboard(module)}
              onDoubleClick={() => createCardCopy(module, position)}
              title="copy to clipboard"
            >
              <BiClipboard />
            </SmallButton>
            <SmallButton onClick={onPin} title={isPinned ? "unpin" : "pin"}>
              {isPinned ? <RiPushpin2Fill /> : <RiPushpin2Line />}
            </SmallButton>
            <RiDragMove2Fill
              className={isPinned ? "" : "handle"}
              size={32}
              style={styleDragButton}
              title="move"
            />
            <SmallButton onClick={onRemove} title="remove">
              <BsTrash />
            </SmallButton>
          </IconContext.Provider>
        </ButtonGroup>
      )}
    </div>
  );
};

export default ModuleToolbar;

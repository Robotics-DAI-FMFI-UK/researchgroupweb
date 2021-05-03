import React, { useState } from "react";
import axios from "axios";
import SmallButton from "../components/buttons/SmallButton";
import { useModeContext } from "../providers/ModeProvider";
import Settings from "./Settings";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { IconContext } from "react-icons";
import { MdRedo, MdSettings, MdUndo } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import { RiEditFill, RiDownloadFill } from "react-icons/ri";
import { BsFileEarmarkPlus } from "react-icons/all";
import NewPageModal from "../components/modals/NewPageModal";
import { getErrorMsg, splitModules } from "../utils/functions";
import { useToastContext } from "../providers/ToastProvider";
import { useActiveModuleContext } from "./ActiveModuleProvider";

const Toolbar = ({ page, setPage, warning, setWarning, layouts, modules }) => {
  const { activeModule } = useActiveModuleContext();
  const { setSuccessToast, setErrorToast } = useToastContext();
  const [editMode, setEditMode] = useModeContext();
  const toggleMode = () => setEditMode((prev) => !prev);

  const [showModal, setShowModal] = useState();
  const toggleModal = (modal) => setShowModal(modal);

  const save = () => {
    console.log("activeModule", activeModule);

    const layoutsWithoutAddBtn = {
      lg: layouts.lg.filter((p) => p.i !== "addButton"),
      md: layouts.md.filter((p) => p.i !== "addButton"),
      sm: layouts.sm.filter((p) => p.i !== "addButton"),
    };

    const { updatedModules, removeIds } = splitModules(modules, activeModule);
    console.log("layouts", layoutsWithoutAddBtn);
    console.log("modules", modules);
    console.log("removeIds", removeIds);

    // return;
    axios
      .patch(`/pages/with-grid/${page._id}`, {
        layouts: layoutsWithoutAddBtn,
        modules: updatedModules,
        removeIds,
      })
      .then((res) => {
        setSuccessToast("Page saved successfully");
        setWarning(false);
        console.log(res);
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
        console.log(err);
      });
  };

  const style = {
    position: "fixed",
    top: "5px",
    left: "5px",
    paddingTop: "97px",
    zIndex: "99",
  };

  return (
    <div className="page-toolbar" style={style}>
      <ButtonGroup vertical>
        <IconContext.Provider value={{ size: "18", color: "white" }}>
          {editMode ? (
            <>
              <SmallButton onClick={toggleMode} title="preview">
                <GoEye />
              </SmallButton>
              <SmallButton
                onClick={() => toggleModal("settings")}
                title="settings"
              >
                <MdSettings />
              </SmallButton>
              <SmallButton
                onClick={() => toggleModal("newPage")}
                title="create new page"
              >
                <BsFileEarmarkPlus />
              </SmallButton>
              <SmallButton title="export">
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(page, null, 2)
                  )}`}
                  download="data.json"
                >
                  <RiDownloadFill />
                </a>
              </SmallButton>
              <SmallButton onClick={save} title="save" disabled={!warning}>
                <BiSave />
              </SmallButton>
            </>
          ) : (
            <SmallButton onClick={toggleMode} title="edit">
              <RiEditFill />
            </SmallButton>
          )}
        </IconContext.Provider>
      </ButtonGroup>
      {showModal === "settings" && (
        <Settings page={page} setPage={setPage} onHide={toggleModal} />
      )}
      {showModal === "newPage" && (
        <NewPageModal onHide={toggleModal} page={page} />
      )}
    </div>
  );
};

export default Toolbar;

// PUBLISH DRAFT
// <SmallButton disabled onClick={saveAndPublish} title="publish">
//   <BiWorld />
//   </SmallButton>
//
// COMPACT TYPE
// <span className="pl-4">compactType?</span>
//
// MARGIN
// const changeMargin = (e) => {
//   setMargin(e.target.value);
// };
// <span
// className="pt-1 pl-4 pr-2"
// style={{ fontSize: ".95em", color: "white" }}
// >
// margin:
// </span>
// <RangeSlider
// className="pr-2"
// size="sm"
// value={margin}
// onChange={changeMargin}
// />
// https://www.npmjs.com/package/react-bootstrap-range-slider
//
// UNDO - REDO
// import useDo from "usedo";
// {/*<SmallButton value="Undo" onClick={undo} disabled={!canUndo} />*/}
// {/*<SmallButton value="Redo" onClick={redo} disabled={!canRedo} />*/}
// <SmallButton disabled title="undo">
//   <MdUndo />
// </SmallButton>
// <SmallButton disabled title="redo">
//   <MdRedo />
// </SmallButton>

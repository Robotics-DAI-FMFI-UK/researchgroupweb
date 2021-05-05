import React, { useState } from "react";
import axios from "axios";
import SmallButton from "../components/buttons/SmallButton";
import { useModeContext } from "../providers/ModeProvider";
import Settings from "./Settings";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { IconContext } from "react-icons";
import { MdSettings } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import { GoEye } from "react-icons/go";
import { RiEditFill, RiDownloadFill } from "react-icons/ri";
import { BsFileEarmarkPlus } from "react-icons/bs";
import NewPageModal from "../components/modals/NewPageModal";
import { getErrorMsg, splitModules } from "../utils/functions";
import { useToastContext } from "../providers/ToastProvider";
import { useActiveModuleContext } from "./ActiveModuleProvider";
import { URL_PREFIX } from "../config";

const Toolbar = ({ page, setPage, warning, setWarning, layouts, modules }) => {
  const { activeModule } = useActiveModuleContext();
  const { setSuccessToast, setErrorToast } = useToastContext();
  const [editMode, setEditMode] = useModeContext();
  const toggleMode = () => setEditMode((prev) => !prev);

  const [showModal, setShowModal] = useState();
  const toggleModal = (modal) => setShowModal(modal);

  const save = () => {
    const layoutsWithoutAddBtn = {
      lg: layouts.lg.filter((p) => p.i !== "addButton"),
      md: layouts.md.filter((p) => p.i !== "addButton"),
      sm: layouts.sm.filter((p) => p.i !== "addButton"),
    };

    const { updatedModules, removeIds } = splitModules(modules, activeModule);

    // return;
    axios
      .patch(`${URL_PREFIX}/pages/with-grid/${page._id}`, {
        layouts: layoutsWithoutAddBtn,
        modules: updatedModules,
        removeIds,
      })
      .then((res) => {
        setSuccessToast("Page saved successfully");
        setWarning(false);
      })
      .catch((err) => {
        setErrorToast(getErrorMsg(err));
      });
  };

  const style = {
    position: "fixed",
    top: "5px",
    left: "5px",
    paddingTop: "124px",
    zIndex: "9999",
  };

  return (
    <div className="page-toolbar" style={style}>
      <div>
        <IconContext.Provider value={{ size: "18", color: "white" }}>
          {editMode ? (
            <>
              <ButtonGroup vertical>
                <SmallButton title="preview" onClick={toggleMode}>
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
              </ButtonGroup>
            </>
          ) : (
            <>
              <SmallButton onClick={toggleMode} title="edit">
                <RiEditFill />
              </SmallButton>
            </>
          )}
        </IconContext.Provider>
      </div>
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

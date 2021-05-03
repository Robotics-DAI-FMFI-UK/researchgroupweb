import React, { useContext, useEffect, useState, createContext } from "react";
import { delEdit, getAuth, getEdit, setEdit } from "../utils/functions";

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(getAuth() && getEdit());

  // useEffect(() => {
  //   editMode ? setEdit() : delEdit();
  // }, [editMode]);

  return (
    <ModeContext.Provider value={[editMode, setEditMode]}>
      {children}
    </ModeContext.Provider>
  );
};

export const useModeContext = () => useContext(ModeContext);

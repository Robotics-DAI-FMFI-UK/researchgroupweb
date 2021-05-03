// import React, { useContext, useState, createContext, useEffect } from "react";
//
// const UnsavedDataContext = createContext();
//
// export const UnsavedDataProvider = ({ children }) => {
//   const [isDirty, setIsDirty] = useState();
//
//   useEffect(() => {
//     window.onbeforeunload = isDirty && (() => "message");
//     console.log("IS DIRTY", isDirty);
//     return () => (window.onbeforeunload = null);
//   }, [isDirty]);
//
//   return (
//     <UnsavedDataContext.Provider value={{ isDirty, setIsDirty }}>
//       {children}
//     </UnsavedDataContext.Provider>
//   );
// };
//
// export const useUnsavedDataContext = () => useContext(UnsavedDataContext);

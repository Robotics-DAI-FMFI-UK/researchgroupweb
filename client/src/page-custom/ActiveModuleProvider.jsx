import React, { createContext, useContext, useEffect, useState } from "react";

const ActiveModuleContext = createContext();

export const ActiveModuleProvider = ({ children, setModules, setWarning }) => {
  const [activeModule, setActiveModule] = useState();
  const [originModule, setOriginModule] = useState();

  useEffect(() => {
    if (activeModule && !originModule)
      setOriginModule(JSON.stringify(activeModule));
  }, [activeModule]);

  const updateModules = (module) => {
    // console.log("UPDATING MODULES", module);
    setModules((prev) => {
      // console.log("prev", prev);
      return prev.map((m) => {
        return m._id === module._id ? module : m;
      });
    });
  };

  const updateActiveModule = (module) => {
    setWarning(originModule !== JSON.stringify(module));
    setActiveModule(module);
  };

  const toggleActiveModule = (module) => {
    // console.log("TOGGGGLEEE");
    // if (module.type === "editor-js") return;

    setActiveModule((prev) => {
      // nebol takze nastavim, netreba updateModules
      if (!prev) return module;

      // ulozim predoslu verziu
      updateModules(prev);

      // je ten isty tak "vypnem"
      if (prev._id === module._id) return undefined;

      // je iny, tak vymenim
      return module;
    });
  };

  const closeActiveModule = () => {
    setActiveModule((prev) => {
      updateModules(prev);
      return undefined;
    });
  };

  return (
    <ActiveModuleContext.Provider
      value={{
        activeModule,
        toggleActiveModule,
        updateActiveModule,
        closeActiveModule,
      }}
    >
      {children}
    </ActiveModuleContext.Provider>
  );
};

export const useActiveModuleContext = () => useContext(ActiveModuleContext);

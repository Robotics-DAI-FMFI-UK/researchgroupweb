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
    setModules((prev) => {
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
    console.log("module", module);
    setActiveModule((prev) => {
      if (!prev) return module;

      updateModules(prev);

      return prev._id === module?._id ? undefined : module;
    });
  };

  const closeActiveModule = () => {
    setActiveModule((prev) => {
      if (prev) {
        updateModules(prev);
      }
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

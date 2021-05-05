import React, { useState } from "react";
import ModuleToolbar from "./ModuleToolbar";
import { ModuleBuilder } from "./ModuleBuilder";
import { useModeContext } from "../../providers/ModeProvider";
import { cloneObj, objectId, roundToTwo } from "../../utils/functions";
import { SizeMe } from "react-sizeme";
import { ROW_HEIGHT } from "../../components/MyGridLayout";
import { usePagesContext } from "../../App";
import { useActiveModuleContext } from "../ActiveModuleProvider";
import _ from "lodash";

export const Module = ({
  module,
  setModules,
  position,
  setLayouts,
  addIntoLayouts,
  warning,
  setWarning,
  breakpoint,
  hasEditPermission,
}) => {
  const { pages } = usePagesContext();
  const { activeModule, toggleActiveModule } = useActiveModuleContext();
  const [editMode] = useModeContext();
  const [showToolbar, setShowToolbar] = useState();
  const [borderColor, setBorderColor] = useState("#fff");

  if (!module) return null;
  const isActive = module._id === activeModule?._id;

  const calcH = (currHeightPx) => {
    return;

    if (!currHeightPx || !calcTypes.includes(module.type) || !editMode) return;
    currHeightPx = Math.round(currHeightPx);

    const prevHeightPx = position.h * ROW_HEIGHT;
    // console.log(`prevPX: ${prevHeightPx} vs currPX: ${currHeightPx}`);

    const currH = roundToTwo(currHeightPx / ROW_HEIGHT);
    console.log(`${module.type}: prevH: ${position.h} vs currH: ${currH}`);

    if (position.h !== currH) return;
    // if (position.h >= currH) return;

    setLayouts((prev) => {
      return {
        ...prev,
        [breakpoint]: prev[breakpoint].map((l) => {
          if (l.i !== position.i) return l;
          return { ...l, h: currH };
        }),
      };
    });
  };

  const handleClick = (e) => {
    if (editMode && hasEditPermission) {
      console.log("click");
      toggleActiveModule(module);
      return;
    }

    const reference = module?.body?.reference;
    if (reference && !warning) {
      redirect(reference);
    }
  };

  const redirect = (reference) => {
    const isExternalRef = reference.substr(0, 5) === "https";

    if (isExternalRef) {
      window.open(reference, "_blank"); // open in new tab
      return;
    }

    const path = pages.find((page) => page._id === reference)?.path;
    if (path) {
      window.open(path, "_self"); // open in the same tab
    }
  };

  const onPin = () => {
    setWarning(true);
    setLayouts((prev) => {
      return {
        ...prev,
        [breakpoint]: prev[breakpoint].map((l) => {
          if (l.i !== module._id) return l;
          return { ...l, static: !position.static };
        }),
      };
    });
  };

  const onRemove = () => {
    setModules((prev) => {
      return prev.map((m) => {
        if (m._id !== module._id) return m;
        return { ...m, isRemoved: true };
      });
    });

    setWarning(true);
    setLayouts((prev) => {
      return {
        lg: prev.lg.filter(({ i }) => i !== module._id),
        md: prev.md.filter(({ i }) => i !== module._id),
        sm: prev.sm.filter(({ i }) => i !== module._id),
      };
    });
  };

  const copyCardToClipboard = (module) => {
    navigator.clipboard.writeText(JSON.stringify(module._id));
  };

  const createCardCopy = (module, position) => {
    const newId = objectId();

    const position_copy = cloneObj(position);
    position_copy.i = newId;

    addIntoLayouts(position_copy, true);
    setModules((prev) => [...prev, { ...module, _id: newId }]);
    setWarning(true);
  };

  const style = {
    height: "100%",
    borderRadius: "4px",
    border: `1px solid ${
      isActive && editMode && hasEditPermission ? "red" : borderColor
    }`,
  };

  const isException = module && module.type === "editor-js";

  return (
    <div
      style={style}
      className={`div-card ${editMode && !isException && "handle"}`}
      onMouseEnter={() => {
        if (editMode && hasEditPermission) {
          setShowToolbar(true);
          setBorderColor("#cce5ff");
        }
      }}
      onMouseLeave={() => {
        setShowToolbar(false);
        setBorderColor("#fff");
      }}
    >
      <div onClick={handleClick} style={style}>
        {editMode && !isException && (
          <div
            style={{
              position: "absolute",
              zIndex: 100,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        )}
        <SizeMe monitorHeight>
          {({ size }) => {
            calcH(size.height);
            return (
              <ModuleBuilder
                module={isActive ? activeModule : module}
                hasEditPermission={hasEditPermission}
              />
            );
          }}
        </SizeMe>
      </div>
      <ModuleToolbar
        position={position}
        module={module}
        isPinned={position.static}
        onPin={onPin}
        onRemove={onRemove}
        showToolbar={showToolbar}
        copyCardToClipboard={copyCardToClipboard}
        createCardCopy={createCardCopy}
      />
    </div>
  );
};

const calcTypes = ["editor-js", "alert"];

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import MyGridLayout from "../components/MyGridLayout";
import {
  cloneObj,
  getUserPermission,
  objectId,
} from "../utils/functions";
import useWarning from "../utils/hooks/useWarning";
import { Module } from "./module/Module";
import SmallButton from "../components/buttons/SmallButton";
import NewModuleModal from "./module/NewModuleModal";
import { useModeContext } from "../providers/ModeProvider";
import { ActiveModuleProvider } from "./ActiveModuleProvider";
import { useAuthContext } from "../providers/AuthProvider";

const CustomPage = ({ initPage }) => {
  document.title = `RG | ${initPage.title}`;

  // ------------ INITIALIZATION ------------
  const { auth } = useAuthContext();
  const [editMode] = useModeContext();
  const hasEditPermission = getUserPermission(initPage, auth);

  const [page, setPage] = useState(initPage);
  const [modules, setModules] = useState(initPage.modules);
  const [newModule, setNewModule] = useState();

  const [warning, setWarning, Prompt] = useWarning();

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const [breakpoint, setBreakpoint] = useState("lg");
  const [layouts, setLayouts] = useState(() => getInitLayouts(initPage));
  // ------------ INITIALIZATION ------------

  // ------------ EVENTS HANDLERS ------------
  useEffect(() => {
    if (!newModule) return;
    setModules((prev) => [...prev, newModule]);
    setWarning(true);
    setNewModule();
  }, [newModule]);

  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts);
  };

  const onBreakpointChange = (bp) => {
    console.log("BREAKPOINT", bp);
    // if (!layouts[bp]) shiftLayout(bp);
    setBreakpoint(bp);
  };
  // ------------ EVENTS HANDLERS ------------

  // ------------ FUNCTIONS ------------
  function shiftLayout(bp, layout) {
    const WIDTH = cols[bp];

    if (!layout) {
      // layout = layouts[bp].sort((a, b) => {
      layout = layouts.lg.sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x; // same row, compare X
        }
        return a.y - b.y; // different row, compare Y
      });
    }

    console.log(`---- START (${bp}) ---- `);

    const autoLayout = [];
    let [last_x, last_y] = [0, 0];

    for (let l = 0; l < layout.length; l++) {
      let { w, h, i } = layout[l];

      if (w > WIDTH) w = WIDTH;

      let mod = (last_x + w) % WIDTH;
      if (mod <= last_x) {
        if (mod === 0) {
          console.log(i, ">> FIT TO THE END");
          autoLayout.push({ x: last_x, y: last_y, w, h, i });
          mod = 0;
        } else {
          console.log(i, ">> SHIFT TO NEW ROW");
          autoLayout.push({ x: 0, y: last_y, w, h, i });
        }
        last_y += 1;
      } else {
        console.log(i, ">> SHIFT TO LEFT");
        autoLayout.push({ x: last_x, y: last_y, w, h, i });
      }
      last_x = mod;
    }

    autoLayout.forEach(({ i, x, y, w }) =>
      console.log(`${i}. [${x}, ${y}]: ${w}`)
    );
    console.log(`---- END (${bp}) ----`);

    setLayouts({ ...layouts, [bp]: autoLayout });
  }

  function addNewModule(module, hardCopy) {
    const module_id = hardCopy ? module._id : objectId();

    const position = cloneObj(addButton);
    position.i = module_id;

    setNewModule({ ...module, _id: module_id });
    addIntoLayouts(position, hardCopy !== undefined);
    return { ...module, _id: module_id };
  }

  function addIntoLayouts(position, last = false) {
    let lastPosition = layouts[breakpoint].find((l) => l.i === addButton.i);

    if (last) {
      let newY = lastPosition.y;
      const newX = (lastPosition.x + 1) % cols[breakpoint];
      if (newX < lastPosition.x) {
        newY += 1;
      }
      position.x = newX;
      position.y = newY;
      lastPosition.x = newX;
      lastPosition.y = newY;
    }

    let newY = lastPosition.y;
    const newX = (lastPosition.x + 1) % cols[breakpoint];
    if (newX < lastPosition.x) {
      newY += 1;
    }

    addButton.x = newX;
    addButton.y = newY;

    setLayouts((prev) => {
      // const index = prev.lg.length - 2;
      // prev.sm.splice(index, 0, position);
      // prev.md.splice(index, 0, position);
      // prev.lg.splice(0, 0, position);
      // console.log(prev.lg);

      // return prev;
      return {
        // ...prev,
        sm: [position, ...prev.sm],
        md: [position, ...prev.md],
        lg: [position, ...prev.lg],
      };
    });

    return position;
  }

  const createGridBoxItem = (position) => {
    const module = modules.find((module) => module._id === position.i);
    return (
      <div key={position.i}>
        <Module
          module={module}
          setModules={setModules}
          position={position}
          layouts={layouts}
          addIntoLayouts={(position, last) => addIntoLayouts(position, last)}
          setLayouts={setLayouts}
          warning={warning}
          setWarning={setWarning}
          breakpoint={breakpoint}
          hasEditPermission={hasEditPermission}
        />
      </div>
    );
  };
  // ------------ FUNCTIONS ------------

  const AddButton = () => (
    <SmallButton
      className="add-item-button"
      style={{ lineHeight: "0.1" }}
      onClick={toggleModal}
    >
      <span>+</span>
    </SmallButton>
  );

  if (!layouts) return null;
  console.log("render PAGE");

  return (
    <>
      <ActiveModuleProvider setModules={setModules} setWarning={setWarning}>
        {hasEditPermission && (
          <Toolbar
            page={page}
            setPage={setPage}
            modules={modules}
            layouts={layouts}
            warning={warning}
            setWarning={setWarning}
          />
        )}
        <MyGridLayout
          breakpoints={breakpoints}
          cols={cols}
          layouts={layouts}
          compactType="vertical"
          onLayoutChange={onLayoutChange}
          draggableHandle=".handle"
          onBreakpointChange={onBreakpointChange}
          setWarning={setWarning}
          isBounded={true}
          simulateBreakpoints={hasEditPermission}
          hasEditPermission={hasEditPermission}
          style={{ backgroundColor: "#eee" }}
          autoSize={true}
        >
          {layouts[breakpoint].slice(0, -1).map(createGridBoxItem)}
          <div
            key={addButton.i}
            style={{
              display: editMode && hasEditPermission ? "inline" : "none",
            }}
          >
            <AddButton />
          </div>
        </MyGridLayout>
        <Sidebar />
        <NewModuleModal
          showModal={showModal}
          modules={modules}
          addNewModule={addNewModule}
          toggleModal={toggleModal}
        />
        {Prompt}
      </ActiveModuleProvider>
    </>
  );
};

// -----------------------------------------------------------

const cols = {
  lg: 6,
  md: 3,
  sm: 1,
};
const breakpoints = {
  lg: 1199,
  md: 799,
  sm: 599,
};
const restrictions = {
  // maxW: 3,
  // maxH: 2,
};
const addButton = {
  i: "addButton",
  w: 1,
  h: 1,
  x: 0,
  y: 0,
  // static: true,
  ...restrictions,
};
const getInitLayouts = (initPage) => {
  const initLayouts = cloneObj(initPage.layouts);
  findLastPosition(initPage.layouts.lg);

  return { ...initLayouts, lg: [...initLayouts.lg, addButton] };
};
const findLastPosition = (layout) => {
  let w = 0;
  let x = 0;
  let y = Math.max(0, ...layout.map((l) => l.y));

  layout
    .filter((l) => l.y === y)
    .forEach((l) => {
      if (l.x >= x) {
        x = l.x;
        w = l.w;
      }
    });

  x += w;
  if (x % 3 < x) {
    y += 1;
  }
  x %= 3;

  addButton.x = x;
  addButton.y = y;
};

export default CustomPage;

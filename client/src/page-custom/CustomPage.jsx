import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import MyGridLayout from "../components/MyGridLayout";
import { getAuth, getUserPermission, objectId } from "../utils/functions";
import useWarning from "../utils/hooks/useWarning";
import { Module } from "./module/Module";
import SmallButton from "../components/buttons/SmallButton";
import _ from "lodash";
import NewModuleModal from "./module/NewModuleModal";
import { useModeContext } from "../providers/ModeProvider";
import { ActiveModuleProvider } from "./ActiveModuleProvider";

const CustomPage = ({ initPage }) => {
  // ------------ INITIALIZATION ------------
  // console.log("CUSTOM PAGE", page);

  const [editMode] = useModeContext();
  const hasEditPermission = getUserPermission(initPage);

  const [page, setPage] = useState(initPage);
  const [modules, setModules] = useState(initPage.modules);
  const [newModule, setNewModule] = useState();

  const [warning, setWarning] = useWarning();

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const [breakpoint, setBreakpoint] = useState("lg"); // todo calc
  const [layouts, setLayouts] = useState(() => getInitLayouts(initPage));

  document.title = initPage.title;
  // ------------ INITIALIZATION ------------

  // ------------ EVENTS HANDLERS ------------
  useEffect(() => {
    // console.log("layouts", layouts);
  }, [layouts]);

  useEffect(() => {
    // console.log("USE EFFECT: addButton", addButton);
  }, [addButton]);

  useEffect(() => {
    console.log("new module", newModule);
    if (!newModule) return;
    setModules((prev) => [...prev, newModule]);
    setWarning(true);
    setNewModule();
  }, [newModule]);

  const onLayoutChange = (layout, layouts) => {
    console.log("layouts", layouts);
    setLayouts(layouts);
  };

  const onBreakpointChange = (bp) => {
    console.log("BREAKPOINT", bp);
    if (!layouts[bp]) shiftLayout(bp);
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

      if (w === 3 && WIDTH === 2) w = 2;
      if (w === 3 && WIDTH === 1) w = 1;
      if (w === 2 && WIDTH === 1) w = 1;

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

  async function addNewModule(module, hardCopy) {
    // console.log(module);

    const module_id = hardCopy ? module._id : objectId();

    const position = _.clone(addButton);
    position.i = module_id;

    console.log("position", position);
    console.log("module", module);
    // return;

    // setLayouts((prev) => {
    //   return {
    //     ...prev,
    //     [breakpoint]: [position, ...prev[breakpoint]],
    //   };
    // });

    console.log("setting new module", module);
    setNewModule({ ...module, _id: module_id });

    addIntoLayouts(position, hardCopy !== undefined);
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
    // console.log("new...Module", layoutWithId);
    // console.log("found...AddButton", lastPosition);
    let newY = lastPosition.y;
    const newX = (lastPosition.x + 1) % cols[breakpoint];
    if (newX < lastPosition.x) {
      newY += 1;
    }
    // lastPosition.x = newX;
    addButton.x = newX;
    addButton.y = newY;
    // console.log("updated...AddButton", lastPosition);

    setLayouts((prev) => {
      return {
        ...prev,
        [breakpoint]: [position, ...prev[breakpoint]],
      };
    });

    return position;
  }

  const createGridBoxItem = (position) => {
    // console.log("position", position);
    const module = modules.find((module) => module._id === position.i);
    return (
      <div key={position.i}>
        {/*{position.i === addButton.i ? (*/}
        {/*  <AddButton />*/}
        {/*) : (*/}
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
        {/*)}*/}
      </div>
    );
  };
  // ------------ FUNCTIONS ------------

  const AddButton = () => (
    <SmallButton className="add-item-button" onClick={toggleModal}>
      <span>+</span>
    </SmallButton>
  );

  if (!layouts) return null;

  return (
    <ActiveModuleProvider setModules={setModules} setWarning={setWarning}>
      {/*<div className="full-width">*/}
      <h1>Custom page</h1>
      {getAuth() && hasEditPermission && (
        <Toolbar
          page={page}
          setPage={setPage}
          modules={modules}
          warning={warning}
          setWarning={setWarning}
          layouts={layouts}
        />
      )}
      <MyGridLayout
        // width={state}
        breakpoints={breakpoints}
        cols={cols}
        compactType="vertical"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        draggableHandle=".handle"
        onBreakpointChange={onBreakpointChange}
        setWarning={setWarning}
        isBounded={true}
        simulateBreakpoints={hasEditPermission}
        hasEditPermission={hasEditPermission}
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
      {hasEditPermission && <Sidebar />}
      {showModal && (
        <NewModuleModal
          modules={modules}
          addNewModule={addNewModule}
          toggleModal={toggleModal}
        />
      )}
      {/*</div>*/}
    </ActiveModuleProvider>
  );
};

// -----------------------------------------------------------

const cols = {
  lg: 3,
  md: 2,
  sm: 1,
};
const BREAKPOINTS = ["lg", "md", "sm"];
const breakpoints = {
  lg: 1200,
  md: 800,
  sm: 600,
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
  const initLayouts = _.clone(initPage.layouts);

  findLastPosition(initLayouts.lg);

  return { ...initLayouts, lg: [...initLayouts.lg, addButton] };
};
const findLastPosition = (layout) => {
  let w = 0;
  let x = 0;
  let y = Math.max(0, ...layout.map((l) => l.y));
  // console.log("y", y);
  layout
    .filter((l) => l.y === y)
    .forEach((l) => {
      if (l.x >= x) {
        x = l.x;
        w = l.w;
      }
    });
  // console.log("x", x);
  x += w;
  // console.log("x + w", x);
  if (x % 3 < x) {
    // console.log("y + 1", y);
    y += 1;
  }
  x %= 3;
  // console.log("x % 3", x);
  addButton.x = x;
  addButton.y = y;
  // setAddButton((prev) => {
  //   return { ...prev, x, y };
  // });
};

export default CustomPage;

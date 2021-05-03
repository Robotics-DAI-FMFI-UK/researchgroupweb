import React, { useEffect, useState } from "react";
import _ from "lodash";
import { getAuth, objectId } from "../../../../../utils/functions";
import SmallButton from "../../../../../components/buttons/SmallButton";
import { ActiveModuleProvider } from "../../../../ActiveModuleProvider";
import Toolbar from "../../../../Toolbar";
import Sidebar from "../../../../Sidebar";
import MyGridLayout from "../../../../../components/MyGridLayout";
import NewModuleModal from "../../../NewModuleModal";
import useWarning from "../../../../../utils/hooks/useWarning";
import { Module } from "../../../Module";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useModeContext } from "../../../../../providers/ModeProvider";

const GridLayout = ({ initPage }) => {
  // ------------ INITIALIZATION ------------
  const [page, setPage] = useState(initPage || {});

  const [modules, setModules] = useState(initPage?.modules || []);

  const [warning, setWarning] = useWarning();

  const [newChild, setNewChild] = useState();

  const [showModal, setShowModal] = useState();
  const toggleModal = () => setShowModal((prev) => !prev);

  const [breakpoint, setBreakpoint] = useState("lg"); // todo calc
  // const [layouts, setLayouts] = useState(() => getInitLayouts(initPage));
  const [layouts, setLayouts] = useState({ lg: [] });

  // document.title = initPage.title;
  // console.log("CUSTOM PAGE", page);
  // ------------ INITIALIZATION ------------

  // ------------ EVENTS HANDLERS ------------
  useEffect(() => {
    console.log("layouts", layouts);
  }, [layouts]);

  useEffect(() => {
    console.log("USE EFFECT: addButton", addButton);
  }, [addButton]);

  useEffect(() => {
    if (!newChild) return;
    setModules((prev) => [...prev, newChild]);
    // setWarning(true);
    setNewChild();
  }, [newChild]);

  const onLayoutChange = (layout, layouts) => {
    // setLayouts(layouts);
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
    console.log(`\n----------------- ${bp}: START -----------------`); //, autoLayout);
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
          console.log(i, ">> FIT TO END");
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
    console.log(`----------------- ${bp}: END -----------------\n`); //, autoLayout);
    setLayouts({ ...layouts, [bp]: autoLayout });
  }

  function addNewModule(module) {
    const newId = objectId();

    const position = _.clone(addButton);
    position.i = newId;

    console.log("position", position);

    setLayouts((prev) => {
      return {
        ...prev,
        [breakpoint]: [position, ...prev[breakpoint]],
      };
    });

    const child = { ...module, _id: newId };
    console.log("child", child);
    setNewChild(child);
    // addIntoLayouts();
  }

  function addIntoLayouts(position, last = false) {
    let lastPosition = layouts[breakpoint].find((l) => l.i === addButton.i);

    if (lastPosition) {
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
          // warning={warning}
          // setWarning={setWarning}
          breakpoint={breakpoint}
        />
        {/*)}*/}
      </div>
    );
  };
  // ------------ FUNCTIONS ------------

  const AddButton = () => (
    <SmallButton
      className="add-item-button"
      // style={{ visibility: editMode ? "visible" : "hidden" }}
      onClick={toggleModal}
    >
      <span>+</span>
    </SmallButton>
  );

  if (!layouts) return null;

  const ResponsiveGridLayout = WidthProvider(Responsive);

  return (
    // <ActiveModuleProvider setModules={setModules} setWarning={setWarning}>
    <div className="full-width">
      {/*{getAuth() && (*/}
      {/*  <Toolbar*/}
      {/*    page={page}*/}
      {/*    setPage={setPage}*/}
      {/*    modules={modules}*/}
      {/*    warning={warning}*/}
      {/*    setWarning={setWarning}*/}
      {/*    layouts={layouts}*/}
      {/*  />*/}
      {/*)}*/}
      <ResponsiveGridLayout
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
        simulateBreakpoints={true}
      >
        {layouts[breakpoint].slice(0, -1).map(createGridBoxItem)}
        <div key={addButton.i}>
          <AddButton />
        </div>
      </ResponsiveGridLayout>
      {/*<Sidebar />*/}
      {showModal && (
        <NewModuleModal
          modules={modules}
          addNewModule={addNewModule}
          toggleModal={toggleModal}
        />
      )}
    </div>
    // </ActiveModuleProvider>
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

export default GridLayout;

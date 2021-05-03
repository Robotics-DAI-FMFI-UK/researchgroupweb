import React, { useState } from "react";
import { useModeContext } from "../providers/ModeProvider";
import { Responsive, WidthProvider } from "react-grid-layout";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "./buttons/SmallButton";

let ResponsiveGridLayout = WidthProvider(Responsive);

export const ROW_HEIGHT = 150;
export const ROW_WIDTH = 300;

const MyGridLayout = ({
  children,
  compactType = "horizontal",
  animated = false,
  isResizable = true,
  margin,
  isDraggable,
  setWarning,
  simulateBreakpoints,
  hasEditPermission,
  // onResizeStop,
  // onResize,
  ...rest
}) => {
  const [editMode] = useModeContext();
  if (hasEditPermission) {
    ResponsiveGridLayout = Responsive;
  }

  const [width, setWidth] = useState(1201);
  // console.log(width);

  isDraggable =
    isDraggable === undefined ? editMode && hasEditPermission : isDraggable;

  const isChanged = (oldItem, newItem) => {
    if (oldItem.i === "addButton") return false;
    return JSON.stringify(oldItem) !== JSON.stringify(newItem);
  };

  const onDragStop = (layout, oldItem, newItem) => {
    if (!setWarning) return;
    if (isChanged(oldItem, newItem)) {
      setWarning(true);
    }
  };

  const onResizeStop = (layout, oldItem, newItem) => {
    if (!setWarning) return;
    if (isChanged(oldItem, newItem)) {
      setWarning(true);
    }
  };

  return (
    <div style={{ width }}>
      {simulateBreakpoints && (
        <div className="d-flex justify-content-center">
          <ButtonGroup className="mb-5 ">
            <SmallButton onClick={() => setWidth(1534)}>lg</SmallButton>
            <SmallButton onClick={() => setWidth(801)}>md</SmallButton>
            <SmallButton onClick={() => setWidth(600)}>sm</SmallButton>
          </ButtonGroup>
        </div>
      )}
      <ResponsiveGridLayout
        // style={{ height: "100vh" }}
        style={{ backgroundColor: "#eee" }}
        width={width}
        compactType={compactType}
        measureBeforeMount={!animated}
        useCSSTransforms={animated}
        autoSize={true}
        isResizable={isResizable && editMode && hasEditPermission}
        isDraggable={isDraggable}
        rowHeight={ROW_HEIGHT}
        {...rest}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        // onResize={onResize}
        // margin={[margin, margin]}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  );
};

export default MyGridLayout;

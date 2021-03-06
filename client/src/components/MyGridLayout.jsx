import React, { useState } from "react";
import { useModeContext } from "../providers/ModeProvider";
import { Responsive, WidthProvider } from "react-grid-layout";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "./buttons/SmallButton";
import { SizeMe } from "react-sizeme";
let ResponsiveGridLayout = WidthProvider(Responsive);

export const ROW_HEIGHT = 75;
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
  breakpoints,
  ...rest
}) => {
  const [editMode] = useModeContext();
  if (hasEditPermission) {
    ResponsiveGridLayout = Responsive;
  }

  const [prevSize, setPrevSize] = useState({ width: 0 });
  const [width, setWidth] = useState(breakpoints.lg + 1);

  isDraggable =
    isDraggable === undefined ? editMode && hasEditPermission : isDraggable;

  isResizable = isResizable && editMode && hasEditPermission;

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

  const handleSizeChange = (size) => {
    if (prevSize.width === size.width) return;

    setWidth(size.width);
    setPrevSize(size);
  };

  const ViewToolbar = () => {
    // render one of the three buttons
    const ViewButton = ({ breakpoint, active, disabled, children }) => (
      <SmallButton
        variant="outline-dark"
        active={active} // to mark pressed button
        disabled={disabled} // disable button with smaller width that the current
        onClick={() => setWidth(breakpoints[breakpoint] + 1)}
      >
        {children} {/* device name */}
      </SmallButton>
    );

    return (
      <div className="d-flex justify-content-center pb-4">
        {/* render group of three buttons for mobile, tablet and desktop  */}
        <ButtonGroup>
          <SmallButton style={{ fontWeight: "bold" }} variant="dark" disabled>
            Device views:
          </SmallButton>
          <ViewButton
            breakpoint="sm"
            active={width <= breakpoints.md}
            disabled={false}
          >
            Mobile
          </ViewButton>
          <ViewButton
            breakpoint="md"
            active={breakpoints.md + 1 <= width && width <= breakpoints.lg}
            disabled={prevSize.width < breakpoints.md}
          >
            Tablet
          </ViewButton>
          <ViewButton
            breakpoint="lg"
            active={width >= breakpoints.lg + 1}
            disabled={prevSize.width < breakpoints.lg}
          >
            Desktop
          </ViewButton>
        </ButtonGroup>
      </div>
    );
  };

  return (
    <div>
      {simulateBreakpoints && <ViewToolbar />}
      <SizeMe>
        {({ size }) => {
          handleSizeChange(size);
          return (
            <ResponsiveGridLayout
              width={width}
              breakpoints={breakpoints}
              compactType={compactType}
              measureBeforeMount={!animated}
              useCSSTransforms={animated}
              isResizable={isResizable}
              isDraggable={isDraggable}
              onDragStop={onDragStop}
              onResizeStop={onResizeStop}
              rowHeight={ROW_HEIGHT}
              {...rest}
            >
              {children}
            </ResponsiveGridLayout>
          );
        }}
      </SizeMe>
    </div>
  );
};

export default MyGridLayout;

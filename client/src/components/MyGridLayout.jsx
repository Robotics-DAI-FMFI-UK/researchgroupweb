import React, { useState } from "react";
import { useModeContext } from "../providers/ModeProvider";
import { Responsive, WidthProvider } from "react-grid-layout";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "./buttons/SmallButton";
import { SizeMe } from "react-sizeme";
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

  const ViewButtons = () => {
    const ViewButton = ({ bp, active, disabled, children }) => (
      <SmallButton
        variant="outline-dark"
        active={active}
        disabled={disabled}
        onClick={() => setWidth(breakpoints[bp] + 1)}
      >
        {children}
      </SmallButton>
    );

    return (
      <div className="d-flex justify-content-center pb-4">
        <ButtonGroup>
          <SmallButton style={{ fontWeight: "bold" }} variant="dark" disabled>
            Device views:
          </SmallButton>
          <ViewButton bp="sm" active={width <= breakpoints.md} disabled={false}>
            Mobile
          </ViewButton>
          <ViewButton
            bp="md"
            active={breakpoints.md + 1 <= width && width <= breakpoints.lg}
            disabled={prevSize.width < breakpoints.md}
          >
            Tablet
          </ViewButton>
          <ViewButton
            bp="lg"
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
      {simulateBreakpoints && <ViewButtons />}
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

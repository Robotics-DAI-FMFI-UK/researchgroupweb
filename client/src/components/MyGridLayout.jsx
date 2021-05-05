import React, {useEffect, useState} from "react";
import { useModeContext } from "../providers/ModeProvider";
import { Responsive, WidthProvider } from "react-grid-layout";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import SmallButton from "./buttons/SmallButton";
import { SizeMe } from "react-sizeme";
import {ModuleBuilder} from "../page-custom/module/ModuleBuilder";
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

  const [prevSize, setPrevSize] = useState({width: 9999});
  const [clicked, setClicked] = useState(false);
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

  useEffect(() => {
    console.log("WIDTH", width)
  }, [width]);


  const calc = (size) => {
    console.log(size.width, width)

    if(prevSize.width === size.width) {
      return
    }

    if (size.width < 600) {
      setWidth(Math.round(size.width))
    } else if (size.width < 800) {
      setWidth(601)
    } else if (size.width < 1200) {
      setWidth(801)
    }

    setPrevSize(size)
    // return width;
  }

  const handleClick = (w) => {
    // setClicked(true)
    setWidth(w)
    // setTimeout(() => {
    //   setClicked(false)
    // }, 1000)
  }

  return (
    <div>
      {simulateBreakpoints && (
        // <div className="ml-0 mb-4">
        <div className="d-flex justify-content-center pb-4">
          <ButtonGroup>
            <SmallButton style={{fontWeight: "bold"}}>Device views:</SmallButton>
            <SmallButton active={width <= 601} onClick={()=>handleClick(601)}>Mobile</SmallButton>
            <SmallButton active={width === 801} disabled={prevSize.width < 801} onClick={()=>handleClick(801)}>Tablet</SmallButton>
            <SmallButton active={width === 1201} disabled={prevSize.width < 1201} onClick={()=>handleClick(1201)}>Desktop</SmallButton>
          </ButtonGroup>
        </div>
      )}
      <SizeMe monitorHeight>
        {({ size }) => {
          calc(size)
          return (


            <ResponsiveGridLayout
              // style={{ height: "100vh" }}
              style={{ backgroundColor: "#eee" }}
              // width={calc(size)}
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
          );
        }}
      </SizeMe>

    </div>
  );
};

export default MyGridLayout;

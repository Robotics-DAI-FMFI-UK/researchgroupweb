import React from "react";
import { MdAddCircle } from "react-icons/md";

import "./style.css";
import SmallButton from "../../../../../components/buttons/SmallButton";

const EventTimeline = (props) => {
  const [timelineData, setTimelineData] = React.useState(
    props.data.events.length > 0 ? props.data : DEFAULT_INITIAL_DATA
  );

  const updateTimelineData = (newData) => {
    setTimelineData(newData);
    if (props.onDataChange) {
      // Inform editorjs about data change
      props.onDataChange(newData);
    }
  };

  const onAddEvent = (e) => {
    const newData = {
      ...timelineData,
    };
    newData.events.push({
      time: "Time",
      description: "Description",
    });
    updateTimelineData(newData);
  };

  const onRemoveEvent = (index) => {
    const newData = {
      ...timelineData,
    };
    newData.events.splice(index, 1);
    updateTimelineData(newData);
  };

  const onContentChange = (index, fieldName) => {
    return (e) => {
      const newData = {
        ...timelineData,
      };
      newData.events[index][fieldName] = e.currentTarget.textContent;
      updateTimelineData(newData);
    };
  };

  return (
    <div className="container mb-2">
      <div className="row">
        <div className="col">
          <ul className="timeline">
            {timelineData.events.map((event, index) => (
              <>
                <li>
                  <p
                    onBlur={onContentChange(index, "time")}
                    contentEditable={!props.readOnly}
                  >
                    {event.time}
                  </p>
                  <p
                    onBlur={onContentChange(index, "description")}
                    contentEditable={!props.readOnly}
                  >
                    {event.description}
                  </p>
                </li>
                {!props.readOnly && (
                  <SmallButton
                    style={{
                      position: "relative",
                      left: "-50px",
                      top: "-100px",
                      // listStyle: "none",
                      // marginLeft: "18px",
                      fontSize: "25px",
                    }}
                    variant="link"
                    color="#0088a9"
                    onClick={() => onRemoveEvent(index)}
                  >
                    &times;
                  </SmallButton>
                )}
              </>
            ))}
          </ul>
          {!props.readOnly && (
            <li
              style={{
                position: "relative",
                top: "-29px",
                zIndex: "2",
                listStyle: "none",
                marginLeft: "18px",
                fontSize: "25px",
              }}
            >
              <MdAddCircle color="#0088a9" onClick={onAddEvent} />
            </li>
          )}
        </div>
      </div>
    </div>
  );
};

const DEFAULT_INITIAL_DATA = () => {
  return {
    events: [
      {
        time: "Time",
        description: "Description",
      },
    ],
  };
};

export default EventTimeline;

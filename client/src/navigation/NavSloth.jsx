import SmallButton from "../components/buttons/SmallButton";
import { BsArrowLeftRight } from "react-icons/bs";
import Select from "react-select";
import React, { useState } from "react";
import { FormControl, Row } from "react-bootstrap";
import "./sloth.css";

export const NavSloth = ({ item: _item, setNavItems, options, setWarning }) => {
  const [item, setItem] = useState(_item);

  const handleSelect = (pages) => {
    setNavItems((prev) => {
      return prev.map((s) => {
        if (s._id !== item._id) return s;
        return { ...s, pages };
      });
    });

    setItem((prev) => {
      return { ...prev, pages };
    });

    setWarning(true);
  };

  const handleChange = (e) => {
    if (e.target.value.length > 10) {
      // ref with prevValue
    }

    setWarning(true);
  };

  const handleBlur = (e) => {
    const name = e.target.value;

    setNavItems((prev) => {
      return prev.map((s) => {
        if (s._id !== item._id) return s;
        return { ...s, name };
      });
    });

    setItem((prev) => {
      return { ...prev, name };
    });

    setWarning(true);
  };

  return (
    <div>
      {/*<SmallButton className="handle btn-block" style={{ maxHeight: "50px" }}>*/}
      <div className="text-center">
        <BsArrowLeftRight color="black" className="handle" size="20" />
      </div>
      {/*</SmallButton>*/}
      {item?.pages.length > 1 && (
        <FormControl
          // className="text-center"
          onBlur={handleBlur}
          onChange={handleChange}
          defaultValue={item.name}
          placeholder="Enter dropdown name"
        />
      )}
      <Select
        isMulti
        isClearable={false}
        value={item?.pages}
        options={options}
        onChange={handleSelect}
      />
    </div>
  );
};

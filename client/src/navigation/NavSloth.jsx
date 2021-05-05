import { BsArrowLeftRight } from "react-icons/bs";
import Select from "react-select";
import React, { useState } from "react";
import FormControl from "react-bootstrap/FormControl";
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
      <div className="text-center">
        <BsArrowLeftRight color="black" className="handle" size="20" />
      </div>
      {item?.pages.length > 1 && (
        <FormControl
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

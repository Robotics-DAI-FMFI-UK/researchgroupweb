import React, { useState } from "react";
import CreatableSelect from "react-select/creatable/dist/react-select.esm";
import { usePagesContext } from "../../../App";

const ReferenceField = ({ activeModule, handleChange }) => {
  const { pages } = usePagesContext();

  const options = pages.map((page) => {
    return { value: page._id, label: page.title };
  });

  const defaultSelected = () => {
    const reference = activeModule?.body?.reference;
    if (!reference) return;

    const isExternalRef = reference.substr(0, 5) === "https";
    if (isExternalRef) {
      return {
        value: reference,
        label: reference, //.substr(8),
      };
    }

    const refPage = options.find(
      (ref) => ref.value === activeModule.body.reference
    );

    if (!refPage) return;
    return {
      value: refPage._id,
      label: refPage.label,
    };
  };

  const selectOption = (option) => {
    console.log("ee", option);
    setSelected(option);
    handleChange({
      target: {
        name: "reference",
        value: option.value,
      },
    });
  };

  const [selected, setSelected] = useState(defaultSelected());

  return (
    <div style={{ marginBottom: "16px" }}>
      <hr />
      <label className="form-label">Page reference</label>
      <CreatableSelect
        menuContainerStyle={{ top: "auto", bottom: "100%" }}
        isClearable
        value={selected}
        onChange={selectOption}
        options={options}
      />
    </div>
  );
};

export default ReferenceField;

import React from "react";
import Form from "react-bootstrap/Form";

export const SearchBar = () => {
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    console.log(searchTerm);
    if (!searchTerm) return;
  };

  return (
    <Form style={{ marginLeft: "100px" }}>
      <Form.Control
        onChange={handleChange}
        type="text"
        placeholder="Search"
        size="sm"
      />
    </Form>
  );
};

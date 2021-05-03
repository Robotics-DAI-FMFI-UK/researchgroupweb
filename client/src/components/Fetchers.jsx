import React from "react";
import Spinner from "react-bootstrap/Spinner";

export const FetchLoading = () => {
  return <Spinner animation="border" className="m-5"/>
}

export const FetchError = ({e}) => {
  return <h6 className="p-5">{`Error: ${e}`}</h6>
}
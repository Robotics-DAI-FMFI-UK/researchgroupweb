import React, { useState, useEffect } from "react";
import { Prompt as RrdPrompt } from "react-router-dom";

const useWarning = () => {
  const [warning, setWarning] = useState(false);
  const Prompt = (
    <RrdPrompt when={warning} message="Changes you made may not be saved." />
  );

  useEffect(() => {
    window.onbeforeunload = warning && (() => "message");
    return () => (window.onbeforeunload = null);
  }, [warning]);

  return [warning, setWarning, Prompt];
};

export default useWarning;

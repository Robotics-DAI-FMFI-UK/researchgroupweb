import { useEffect, useState } from "react";

const useWarning = () => {
  const [warning, setWarning] = useState();

  useEffect(() => {
    // console.log("IS DIRTY", warning);
    window.onbeforeunload = warning && (() => "message");
    return () => (window.onbeforeunload = null);
  }, [warning]);

  return [warning, setWarning];
};

export default useWarning;

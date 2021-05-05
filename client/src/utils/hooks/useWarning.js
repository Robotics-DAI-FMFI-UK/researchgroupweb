import { useEffect, useState } from "react";

const useWarning = () => {
  const [warning, setWarning] = useState();

  useEffect(() => {
    window.onbeforeunload = warning && (() => "message");
    return () => (window.onbeforeunload = null);
  }, [warning]);

  return [warning, setWarning];
};

export default useWarning;

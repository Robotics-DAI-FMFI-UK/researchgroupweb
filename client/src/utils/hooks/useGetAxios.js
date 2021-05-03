import { useEffect, useState } from "react";
import axios from "axios";

const useGetAxios = (url) => {
  const [state, setState] = useState({});

  useEffect(() => {
    console.log("url", url);
    axios
      .get(url)
      .then((res) => {
        setState({
          isLoaded: true,
          data: res.data,
        });
      })
      .catch((err) => {
        setState({
          isLoaded: false,
          error: err,
        });
      });
  }, [url]);

  return state;
};

export default useGetAxios;

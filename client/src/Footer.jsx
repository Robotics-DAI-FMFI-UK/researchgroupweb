import React from "react";
import { usePagesContext } from "./App";

const Footer = () => {
  const { pages } = usePagesContext();

  const pathname = window.location.pathname;
  const path = pathname.substr(pathname.lastIndexOf("/"));
  const page = pages.find((page) => page.path === path);

  // console.log(pathname, "=>", path);

  // if (!page)
  return null;

  return (
    <div style={{}}>
      <p>This page was last edited on {page.update_date}.</p>
    </div>
  );
};

export default Footer;

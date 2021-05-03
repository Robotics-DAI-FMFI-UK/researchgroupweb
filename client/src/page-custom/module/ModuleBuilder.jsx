import React from "react";
import EditorJS from "./types/editor-js/EditorJS";
import Carousel from "./types/Carousel";
import Image from "./types/Image";
import Alert from "./types/Alert";
import Html from "./types/Html";
import "./modules.css";

export const ModuleBuilder = ({ module, hasEditPermission }) => {
  switch (module.type) {
    case "alert":
      return <Alert module={module} />;
    case "carousel":
      return <Carousel module={module} />;
    case "editor-js":
      return <EditorJS module={module} hasEditPermission={hasEditPermission} />;
    case "html":
      return <Html module={module} />;
    case "image":
      return <Image module={module} />;
    default:
      return <Alert module={{ body: { heading: "Module was not found." } }} />;
  }
};

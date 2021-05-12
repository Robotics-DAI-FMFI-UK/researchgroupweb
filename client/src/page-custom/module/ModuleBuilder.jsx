import React from "react";
import EditorJS from "./types/editor-js/EditorJS";
import Carousel from "./types/Carousel";
import Image from "./types/Image";
import Alert from "./types/Alert";
import Html from "./types/Html";
import "./modules.css";

export const ModuleBuilder = ({ module, hasEditPermission }) => {
  const factory = () => {
    switch (module.type) {
      case "alert":
        return Alert;
      case "carousel":
        return Carousel;
      case "editor-js":
        return EditorJS;
      case "html":
        return Html;
      case "image":
        return Image;
      default:
        return null;
    }
  };

  const Module = factory();

  if (!Module) {
    return <h3>Module not found</h3>;
  }
  return <Module module={module} hasEditPermission={hasEditPermission} />;
};

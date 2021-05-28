import React, { Suspense, lazy } from "react";
import EditorJS from "./types/editor-js/EditorJS";
import Alert from "./types/Alert";

const SuspendImage = lazy(() => import("./types/Image"));
const SuspendHtml = lazy(() => import("./types/Html"));
const SuspendVideo = lazy(() => import("./types/Video"));
const SuspendCarousel = lazy(() => import("./types/Carousel"));

export const ModuleBuilder = ({ module, setUnsavedWarning }) => {
  const Fallback = () => {
    return <div>Loading...</div>;
  };

  switch (module.type) {
    case "alert":
      return <Alert module={module} />;
    case "editor-js":
      return <EditorJS module={module} setUnsavedWarning={setUnsavedWarning} />;
    case "carousel":
      return (
        <Suspense fallback={<Fallback />}>
          <SuspendCarousel module={module} />
        </Suspense>
      );
    case "html":
      return (
        <Suspense fallback={<Fallback />}>
          <SuspendHtml module={module} />
        </Suspense>
      );
    case "image":
      return (
        <Suspense fallback={<Fallback />}>
          <SuspendImage module={module} />
        </Suspense>
      );
    case "video":
      return (
        <Suspense fallback={<Fallback />}>
          <SuspendVideo module={module} />
        </Suspense>
      );
    default:
      return <Alert module={{ body: { heading: "Module was not found." } }} />;
  }
};

// import React from "react";
// import EditorJS from "./types/editor-js/EditorJS";
// import Alert from "./types/Alert";
// import "./modules.css";
// import Image from "./types/Image";
// import Html from "./types/Html";
// import Video from "./types/Video";
// import Carousel from "./types/Carousel";
//
// export const ModuleBuilder = ({ module, hasEditPermission }) => {
//   const factory = () => {
//     switch (module.type) {
//       case "alert":
//         return Alert;
//       case "carousel":
//         return Carousel;
//       case "editor-js":
//         return EditorJS;
//       case "html":
//         return Html;
//       case "image":
//         return Image;
//       case "video":
//         return Video;
//       default:
//         return null;
//     }
//   };
//
//   const Module = factory();
//
//   if (!Module) {
//     return <h3>Module not found</h3>;
//   }
//   return <Module module={module} hasEditPermission={hasEditPermission} />;
// };

// src: https://github.com/editor-js/awesome-editorjs

// TEXT
// import Paragraph from "@editorjs/paragraph";
// import Header from "@editorjs/header";
import Paragraph from "editorjs-paragraph-with-alignment"; // https://github.com/kaaaaaaaaaaai/paragraph-with-alignment
import Header from "editorjs-header-with-anchor"; // https://github.com/Aleksst95/header-with-anchor
import CheckList from "@editorjs/checklist";
import CodeBox from "./codebox";
import Delimiter from "@editorjs/delimiter";

// LIST
import List from "@editorjs/list";
// import NestedList from "@editorjs/nested-list"; // https://github.com/editor-js/nested-list

// TABLE
import Table from "@editorjs/table";
// import Table from "editorjs-table"; // https://github.com/editor-js/table NOT WORK ON READONLY
// import Table from "./table/plugin";

// MEDIA / EMBED
import Alert from "editorjs-alert"; // https://github.com/vishaltelangre/editorjs-alert
import Html from "@editorjs/embed"; // https://github.com/editor-js/embed
import AttachesTool from "./attaches"; // https://github.com/editor-js/attaches
// import LinkTool from "@editorjs/link"; // https://github.com/editor-js/link
// import Image from "@editorjs/custom-image";
// import Gist from "editorjs-github-gist-plugin"; // https://github.com/ranemihir/editorjs-github-gist-plugin
// import SocialPost from "editorjs-social-post-plugin"; // https://github.com/ranemihir/editorjs-social-post-plugin
// import SimpleImage from "@editorjs/simple-custom-image";

// INLINE TOOLS
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code"; // https://github.com/editor-js/inline-code
// import { StyleInlineTool } from "editorjs-style"; // https://github.com/hata6502/editorjs-style
// https://github.com/natterstefan/editorjs-inline-tool

import SimpleImage from "@editorjs/simple-image";

// CUSTOM
import Image from "./custom-image/tool";
import ImageTool from "@editorjs/image";
import Timeline from "./custom-timeline/tool";
import { MDImporter, MDParser } from "./markdown";

// TUNES
import AlignmentBlockTune from "./align-tune";

export const EDITOR_JS_TOOLS = {
  codeBox: CodeBox,

  attaches: {
    class: AttachesTool,
    config: {
      endpoint: "http://localhost:4000/upload",
    },
  },
  checkList: CheckList,
  delimiter: Delimiter,

  alignTune: AlignmentBlockTune,
  // social: SocialPost,

  marker: Marker,
  inlineCode: InlineCode,

  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    // tunes: ["alignTune"],
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ["alignTune"],
  },
  embed: Html,
  table: Table,
  alert: Alert,

  // image: Image,
  markdownParser: MDParser,
  markdownImporter: MDImporter,
  timeline: Timeline,

  // linkTool: LinkTool,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:4000/upload", // Your backend file uploader endpoint
        byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
      },
    },
  },
  // gist: Gist,
};

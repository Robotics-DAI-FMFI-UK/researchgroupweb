import React from "react";
import ReactDOM from "react-dom";
import EventAttach from "./eventAttach";
import Uploader from "../attaches/uploader";
import Icon from "./svg/Toolbox";

export default class Attach {
  static get toolbox() {
    return {
      icon: <Icon />,
      title: "Attaches",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this.nodes = {
      wrapper: null,
      button: null,
      title: null,
    };

    this._data = {
      file: {},
      title: "",
    };

    this.config = {
      endpoint: config.endpoint || "",
      field: config.field || "file",
      types: config.types || "*",
      buttonText: config.buttonText || "Select file to upload",
      errorMessage: config.errorMessage || "File upload failed",
    };

    this.data = data;

    /**
     * Module for files uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response) => this.onUpload(response),
      onError: (error) => this.uploadingFailed(error),
    });

    this.enableFileUpload = this.enableFileUpload.bind(this);
  }

  /**
   * Tool's CSS classes
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      apiButton: this.api.styles.button,
      loader: this.api.styles.loader,
      /**
       * Tool's classes
       */
      wrapper: "cdx-attaches",
      wrapperWithFile: "cdx-attaches--with-file",
      wrapperLoading: "cdx-attaches--loading",
      button: "cdx-attaches__button",
      title: "cdx-attaches__title",
      size: "cdx-attaches__size",
      downloadButton: "cdx-attaches__download-button",
      fileInfo: "cdx-attaches__file-info",
      fileIcon: "cdx-attaches__file-icon",
    };
  }

  /**
   * Possible files' extension colors
   */
  get EXTENSIONS() {
    return {
      doc: "#3e74da",
      docx: "#3e74da",
      odt: "#3e74da",
      pdf: "#d47373",
      rtf: "#656ecd",
      tex: "#5a5a5b",
      txt: "#5a5a5b",
      pptx: "#e07066",
      ppt: "#e07066",
      mp3: "#eab456",
      mp4: "#f676a6",
      xls: "#3f9e64",
      html: "#2988f0",
      htm: "#2988f0",
      png: "#f676a6",
      jpg: "#f67676",
      jpeg: "#f67676",
      gif: "#f6af76",
      zip: "#4f566f",
      rar: "#4f566f",
      exe: "#e26f6f",
      svg: "#bf5252",
      key: "#e07066",
      sketch: "#df821c",
      ai: "#df821c",
      psd: "#388ae5",
      dmg: "#e26f6f",
      json: "#2988f0",
      csv: "#3f9e64",
    };
  }

  /**
   * Return Block data
   * @param {HTMLElement} toolsContent
   * @return {AttachesToolData}
   */
  save(toolsContent) {
    /**
     * If file was uploaded
     */
    if (this.pluginHasData()) {
      const title = toolsContent.querySelector(`.${this.CSS.title}`).innerHTML;

      Object.assign(this.data, { title });
    }

    return this.data;
  }

  render() {
    const rootNode = document.createElement("div");
    rootNode.setAttribute("class", this.CSS.wrapper);
    this.nodes.holder = rootNode;

    const onDataChange = (newData) => {
      this.data = {
        ...newData,
      };
    };

    ReactDOM.render(
      <EventAttach
        onDataChange={onDataChange}
        readOnly={this.readOnly}
        data={this.data}
      />,
      rootNode
    );

    return this.nodes.holder;
  }
}

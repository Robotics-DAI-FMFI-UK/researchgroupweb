import React from "react";
import ReactDOM from "react-dom";
import EventImage from "./eventImage";
import CustomPage from "../../../../CustomPage";
import GridLayout from "./GridLayout";

export default class Grid {
  static get toolbox() {
    return {
      icon: "G",
      title: "Grid",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = data;
    this.settings = [
      { name: "title", icon: "T" },
      { name: "subtitle", icon: "S" },
    ];

    this.CSS = {
      wrapper: "walkthrough-custom-timeline",
    };

    this.nodes = {
      holder: null,
    };
  }

  render() {
    const rootNode = document.createElement("div");
    rootNode.setAttribute("class", this.CSS.wrapper);
    this.nodes.holder = rootNode;

    const onDataChange = (newData) => {
      this.data = {
        ...newData,
      };
      console.log("tool changed");
      console.log(this.data);
    };

    ReactDOM.render(
      <GridLayout
        onDataChange={onDataChange}
        readOnly={this.readOnly}
        data={this.data}
      />,
      rootNode
    );

    return this.nodes.holder;
  }

  renderSettings() {
    const wrapper = document.createElement("div");

    this.settings.forEach((tune) => {
      let button = document.createElement("div");

      button.classList.add("cdx-settings-button");
      button.classList.toggle(
        "cdx-settings-button--active",
        this.data[tune.name].enable
      );
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      button.addEventListener("click", () => {
        this._toggleTune(tune.name);
        button.classList.toggle("cdx-settings-button--active");
      });
    });

    return wrapper;
  }

  _toggleTune(tune) {
    console.log("Image tune clicked", tune);
    this.data[tune].enable = !this.data[tune].enable;
  }

  save() {
    return this.data;
  }
}

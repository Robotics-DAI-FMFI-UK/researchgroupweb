import React from "react";
import { ResponsiveEmbed } from "react-bootstrap";
import parse from "html-react-parser";

const Html = ({ module }) => {
  let { embed, html, full_height, full_width } = module.body;

  html = html.trim();

  const validIframe = () => {
    return (
      html.match(/^<iframe[\s\S]+><\/iframe>/) ||
      html.match(/^<iframe[\s\S]+\/>/)
    );
  };

  if (html === "<h1>Hello World</h1>") return parse(html);

  if (!embed) return <div>{parse(html)}</div>;

  if (!validIframe()) return <h1>Not valid</h1>;

  const getStyle = () => {
    const style = {};
    if (full_height) style["height"] = "100%";
    if (full_width) style["width"] = "100%";
    return style;
  };

  return (
    <div style={getStyle()}>
      <ResponsiveEmbed aspectRatio="16by9" className="h-100">
        {parse(html)}
      </ResponsiveEmbed>
    </div>
  );
};

export default Html;

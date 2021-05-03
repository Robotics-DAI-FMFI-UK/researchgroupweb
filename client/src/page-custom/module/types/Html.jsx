import React from "react";
import { ResponsiveEmbed } from "react-bootstrap";
import parse from "html-react-parser";

const Html = ({ module }) => {
  if (!module.body) module.body = placeholder;
  const { embed, html } = module.body;

  return embed ? (
    <ResponsiveEmbed aspectRatio="16by9" className="grid-module">
      {parse(html)}
    </ResponsiveEmbed>
  ) : (
    parse(html)
  );
};

const placeholder = {
  embed: true,
  html:
    "<iframe\n" +
    '  className="embed-post"\n' +
    '  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmesto.ruzomberok%2Fposts%2F10165406592765790&width=500&show_text=true&appId=1952550874919546&height=550"\n' +
    '  width="500"\n' +
    '  height="550"\n' +
    '  scrolling="no"\n' +
    '  frameBorder="0"\n' +
    "  allowFullScreen={true}\n" +
    '  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"\n' +
    "/>",
};

export default Html;

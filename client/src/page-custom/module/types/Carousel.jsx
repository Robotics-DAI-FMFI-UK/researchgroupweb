import React, { useState } from "react";
import { Carousel as BsCarousel } from "react-bootstrap";
import "./carousel.css";

const Carousel = ({ module }) => {
  const [index, setIndex] = useState(0);
  if (!module.body) module.body = placeholder;
  const {
    items,
    indicators,
    fade,
    allowPause,
    interval,
    controls,
    objectFit,
    backgroundColor,
  } = module.body;

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <BsCarousel
      activeIndex={index}
      onSelect={handleSelect}
      fade={fade}
      pause={allowPause ? "hover" : false}
      controls={controls}
      indicators={indicators}
      className="_carousel"
      style={{ backgroundColor }}
    >
      {items.map((src, i) => (
        <BsCarousel.Item interval={interval * 1000} className="item" key={i}>
          <img className="item-img" src={src} alt={src} style={{ objectFit }} />
        </BsCarousel.Item>
      ))}
    </BsCarousel>
  );
};

const placeholder = {
  items: ["/img-placeholder.jpg", "/img-placeholder.jpg"],
  indicators: true,
  fade: false,
  allowPause: true,
  interval: 3,
  controls: false,
  objectFit: "none",
  backgroundColor: "#eee",
};

export default Carousel;

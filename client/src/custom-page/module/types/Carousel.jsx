import React, { useState } from "react";
import { Carousel as BsCarousel } from "react-bootstrap";
import "./carousel.css";
import Card from "react-bootstrap/Card";

const Carousel = ({ module }) => {
  const [index, setIndex] = useState(0);

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
      {items?.map((src, i) => (
        <BsCarousel.Item interval={interval * 1000} className="item" key={i}>
          <img className="item-img" src={src} alt={src} style={{ objectFit }} />
        </BsCarousel.Item>
      ))}
    </BsCarousel>
  );

  // const imgStyle = {
  //   objectFit: objectFit,
  //   height: "100%",
  // };
  //
  // const cardStyle = {
  //   backgroundColor: backgroundColor,
  //   height: "100%",
  // };
  //
  // const titleStyle = {
  //   backgroundColor: "rgba(119,119,119,.5)",
  //   padding: ".75rem",
  //   maxHeight: "90%",
  //   textOverflow: "ellipsis",
  //   overflow: "hidden",
  // };
  //
  // const subtitleStyle = {
  //   fontSize: "1rem",
  //   backgroundColor: "rgb(101,116,136,.8)",
  //   padding: ".25rem .75rem",
  //   display: "inline-block",
  //   margin: "0",
  //   maxWidth: "100%",
  //   whiteSpace: "nowrap",
  //   textOverflow: "ellipsis",
  //   overflow: "hidden",
  // };
  //
  // const overlayStyle = {
  //   top: "unset",
  // };

  // return (
  //   <BsCarousel
  //     activeIndex={index}
  //     onSelect={handleSelect}
  //     fade={fade}
  //     pause={allowPause ? "hover" : false}
  //     controls={controls}
  //     indicators={indicators}
  //     className="_carousel"
  //     style={{ backgroundColor }}
  //   >
  //     {items.map(({ src, title, subtitle }, i) => (
  //       <BsCarousel.Item interval={interval * 1000} className="item" key={i}>
  //         <Card key={i} className="text-white" style={cardStyle}>
  //           <Card.Img src={src} alt={"alt"} style={imgStyle} />
  //           <Card.ImgOverlay style={overlayStyle}>
  //             {subtitle && (
  //               <Card.Title style={subtitleStyle} className="align-self-end">
  //                 {subtitle}
  //               </Card.Title>
  //             )}
  //             {title && (
  //               <Card.Title style={titleStyle} className="align-self-end">
  //                 {title}
  //               </Card.Title>
  //             )}
  //           </Card.ImgOverlay>
  //         </Card>
  //         {/*<img className="item-img" src={src} alt={src} style={{ objectFit }} />*/}
  //       </BsCarousel.Item>
  //     ))}
  //   </BsCarousel>
  // );
};

// const placeholder = {
// items: [
//   {
//     src: "/img-placeholder.jpg",
//     title: "title",
//     subtitle: "subtitle",
//   },
//   {
//     src: "/img-placeholder.jpg",
//     title: "title",
//     subtitle: "subtitle",
//   },
// ],
// };

export default Carousel;

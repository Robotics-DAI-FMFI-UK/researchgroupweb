import React, { useState, createRef } from "react";
import AvatarEditor from "react-avatar-editor";
// import Dropzone from "react-dropzone";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

const ImageEditor = ({ src, saveImage }) => {
  const [image, setImage] = useState(`${src}`); // fixme not load
  const [preview, setPreview] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [radius, setRadius] = useState(0);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  const cropper = createRef();
  const allowZoomOut = false;

  const getImage = () => cropper.current.getImageScaledToCanvas().toDataURL();
  const handleDropImage = (files) => setImage(files[0]);
  const handleNewImage = (e) => setImage(e.target.files[0]);
  const handleRotate = (e) => setRotate(parseFloat(e.target.value) * 3.6);
  const handleScale = (e) => setScale(parseFloat(e.target.value));
  const onPositionChange = (xy) => setPosition(xy);
  const handlePreview = () =>
    preview ? setPreview(null) : setPreview(getImage());
  const handleSave = () => saveImage(getImage());

  // https://codesandbox.io/s/pm8qpzo0v0?file=/src/components/ImageEditor.js
  const toggleCropper = (isToggled) => {
    // if (isToggled) {
    //   this.setState({ selectorVisibleStyle: { display: 'inline-block' } });
    //   this.setState({ mainCanvasVisibleStyle: { display: 'none' } });
    // }
    // else {
    //   this.setState({ selectorVisibleStyle: { display: 'none' } });
    //   this.setState({ mainCanvasVisibleStyle: { display: 'inline-block' } });
    // }
  };
  const cropImage = () => {
    // if (this.editor) {
    //   console.log("The editor is: "+ this.editor);
    //   const canvas = this.editor.getImageScaledToCanvas();
    //   this.setState({ imgCropData: canvas.toDataURL() });
    //   this.toggleCropper(true);
    // }
  };
  const downloadImage = () => {
    // if (this.editor) {
    //   const MyCanvas = this.editor.getImageScaledToCanvas();
    //   MyCanvas.id = "myCanvas";
    //   ReactDOM.render(MyCanvas, this.refs.imageEditorContainer);
    //   console.log(MyCanvas);
    //   canvasToImage('myCanvas', {
    //     name: 'Image',
    //     type: 'jpg',
    //     quality: 1
    //   });
    // }
  };

  return (
    <div style={{ width: 250 }}>
      {/* https://codesandbox.io/s/vxodd?file=/src/ImageComposer.js:1115-1120 */}
      {/*<Dropzone*/}
      {/*  onDrop={handleDrop}*/}
      {/*  disableClick={true}*/}
      {/*  multiple={false}*/}
      {/*  style={{*/}
      {/*    width: "350px",*/}
      {/*    height: "350px",*/}
      {/*    marginBottom: "35px"*/}
      {/*  }}*/}
      {/*>*/}
      {preview ? (
        <img src={preview} alt={"alt"} />
      ) : (
        <AvatarEditor
          ref={cropper}
          image={image}
          color={[255, 255, 255, 0.6]} // RGBA
          position={position}
          onPositionChange={onPositionChange}
          scale={scale}
          rotate={rotate}
          borderRadius={radius}
          height={200}
          width={200}
        />
      )}
      {/*</Dropzone>*/}

      <Form.Group>
        <Form.File
          onChange={handleNewImage}
          id="custom-file"
          label="Custom file input"
          custom
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Zoom:</Form.Label>
        <Form.Control
          name="scale"
          type="range"
          onChange={handleScale}
          min={allowZoomOut ? "0.1" : "1"}
          max="4"
          step="0.01"
          defaultValue="1"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Rotate:</Form.Label>
        <Form.Control
          name="range"
          type="range"
          onChange={handleRotate}
          step=".5"
          defaultValue="1"
        />
      </Form.Group>
      <Button onClick={handlePreview}>Preview</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default ImageEditor;

import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import {URL_PREFIX} from "../../config";

const UploadFile = ({ onUploadChange, url = `${URL_PREFIX}/upload` }) => {
  const [filename, setFilename] = useState("Select local file");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = async (e) => {
    console.log("onchange");
    const file = e.target.files[0];
    console.log("file", file);
    if (!file) return;

    setFilename(file.name);
    // e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadChange({
        target: {
          name: "src",
          value: res.data.filePath,
        },
      });
    } catch (err) {
      console.log("err", err);
      setErrorMsg("Upload failed");
    }
  };

  return (
    <>
      <Form.File
        custom
        label={filename}
        onChange={onChange}
        isInvalid={errorMsg}
      />
      {/*<Form.File onChange={onChange} custom />*/}
      {/*<Form.File.Input isInvalid={errorMsg} />*/}
      {/*<Form.File.Label>{filename}</Form.File.Label>*/}
      <Form.Control.Feedback type="invalid">{errorMsg}</Form.Control.Feedback>
    </>
  );
};

export default UploadFile;
//
// import React, { Fragment, useState } from "react";
// import UploadMessage from "./UploadMessage";
// import UploadProgress from "./UploadProgress";
// import axios from "axios";
// import Form from "react-bootstrap/Form";
// import SmallButton from "../buttons/SmallButton";
//
// const UploadFile = ({ onUploadChange, url = "/upload" }) => {
//   const [file, setFile] = useState("");
//   const [filename, setFilename] = useState("Choose File");
//   const [uploadedFile, setUploadedFile] = useState({});
//   const [message, setMessage] = useState("");
//   const [uploadPercentage, setUploadPercentage] = useState(0);
//
//   const onChange = (e) => {
//     if (!e.target.files[0]) return;
//     setFile(e.target.files[0]);
//     setFilename(e.target.files[0].name);
//
//     // e.preventDefault(); // Cancels Event (Stops HTML Default Form Submit)
//     // e.stopPropagation(); // Prevents Event Bubbling To Parent Elements
//   };
//
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("file", file);
//
//     try {
//       const res = await axios.post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         onUploadProgress: (progressEvent) => {
//           setUploadPercentage(
//             parseInt(
//               Math.round((progressEvent.loaded * 100) / progressEvent.total)
//             )
//           );
//           // Clear percentage
//           setTimeout(() => {
//             setMessage("");
//             setUploadPercentage(0);
//           }, 7000);
//         },
//       });
//
//       const { fileName, filePath } = res.data;
//
//       onUploadChange({
//         target: {
//           name: "src",
//           value: filePath,
//         },
//       });
//
//       // setUploadedFile({ fileName, filePath });
//       setMessage("File Uploaded");
//     } catch (err) {
//       console.log(err);
//       // setMessage(err.response.data.message);
//     }
//   };
//
//   return (
//     <>
//       {message && <UploadMessage msg={message} />}
//       <span>{filename}</span>
//       <Form.File onChange={onChange} label="Select local file" custom />
//       <Form.Control.Feedback type="valid">{filename}</Form.Control.Feedback>
//       <UploadProgress percentage={uploadPercentage} />
//       <SmallButton
//         onClick={onSubmit}
//         variant="light"
//         className="btn-block mt-1 mb-3"
//       >
//         upload
//       </SmallButton>
//       {/*{uploadedFile && (*/}
//       {/*  <div className="row mt-5">*/}
//       {/*    <div className="col-md-6 m-auto">*/}
//       {/*      <h3 className="text-center">{uploadedFile.fileName}</h3>*/}
//       {/*      <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />*/}
//       {/*    </div>*/}
//       {/*  </div>*/}
//       {/*)}*/}
//     </>
//   );
// };
//
// export default UploadFile;

import express from "express";
import cors from "cors";
import fs from "fs";
import fileUpload from "express-fileupload";
import https from "https";
import { redirectToHTTPS } from "express-http-to-https";

// connect to db
require("dotenv").config();
require("./config/mongoose");

// /routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import pageRoutes from "./routes/pages";
import moduleRoutes from "./routes/modules";
import uploadRoutes from "./routes/upload";
import navbarRoutes from "./routes/navbars";

const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(cors({ origin: true }));
app.use("/uploads", express.static("uploads"));
app.use(redirectToHTTPS([/localhost:4001/]));

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/navbars", navbarRoutes);

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// run server
const PORT = process.env.PORT;

if (PORT == 4001) {
  // develop
  app.listen(PORT, () => console.log(`Server Started`));
} else {
  // production
  const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE || "");
  const certificate = fs.readFileSync(process.env.SSL_CRT_FILE || "");
  https
    .createServer(
      {
        key: privateKey || "",
        cert: certificate || "",
      },
      app
    )
    .listen(PORT, () => {
      console.log("Server Started");
    });
}

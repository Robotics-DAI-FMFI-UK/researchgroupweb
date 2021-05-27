import express from "express";
import cors from "cors";
import path from "path";

// connect to db
require("dotenv").config();
require("./config/mongoose");
import fileUpload from "express-fileupload";

// /routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import pageRoutes from "./routes/pages";
import moduleRoutes from "./routes/modules";
import uploadRoutes from "./routes/upload";
import navbarRoutes from "./routes/navbars";

const app = express();
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "build")));
app.use(cors({ origin: true }));

// use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/pages", pageRoutes);
app.use("/modules", moduleRoutes);
app.use("/upload", uploadRoutes);
app.use("/navbars", navbarRoutes);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// run server
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server Started on http://localhost:${PORT}/`)
);

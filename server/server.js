import express from "express";
import cors from "cors";

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
app.use(express.json());
app.use(cors({ origin: true }));

// use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/pages", pageRoutes);
app.use("/modules", moduleRoutes);
app.use("/upload", uploadRoutes);
app.use("/navbars", navbarRoutes);

// run server
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server Started on http://localhost:${PORT}/`)
);

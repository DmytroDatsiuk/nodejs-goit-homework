require("dotenv").config();

const express = require("express");
const app = express();
const { contactRouter } = require("./routes/api/contacts");
const logger = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/api/auth.js");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/contacts", contactRouter);
app.use("/users", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

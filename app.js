const express = require("express");
const app = express();
const { contactRouter } = require("./routes/api/contacts");
const { globalErrorHandler } = require("./middlewares/globalErrorHandler");

app.use(express.json());
app.use("/contacts", contactRouter);
app.use(globalErrorHandler);

module.exports = app;

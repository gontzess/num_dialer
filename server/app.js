require("dotenv").config();

const express = require("express");
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");

const app = express();

const phoneNumbers = [
  { phoneNumber: "13018040009", phoneNumberId: 11 },
  { phoneNumber: "19842068287", phoneNumberId: 22 },
  { phoneNumber: "15512459377", phoneNumberId: 33 },
  { phoneNumber: "19362072765", phoneNumberId: 44 },
  { phoneNumber: "18582210308", phoneNumberId: 55 },
  { phoneNumber: "13018040009", phoneNumberId: 66 },
  { phoneNumber: "19842068287", phoneNumberId: 77 },
  { phoneNumber: "15512459377", phoneNumberId: 88 },
  { phoneNumber: "19362072765", phoneNumberId: 99 },
];

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.get("/phoneNumbers", (_, res) => {
  res.json(phoneNumbers);
});

app.post("/callPhoneNumbers", (_, res) => {
  res.sendStatus(200);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

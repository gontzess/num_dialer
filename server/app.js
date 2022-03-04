require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");
const runTasks = require("./utils/runTasks");
const Deferred = require("./utils/Deferred");
const {
  phoneNumbers,
  activeCalls,
  callPhoneNumber,
} = require("./utils/phoneHelpers");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());
app.use(express.json());

app.get("/phoneNumbers", (_, res) => {
  res.json(phoneNumbers);
});

app.post("/callPhoneNumbers", (_, res) => {
  runTasks(
    phoneNumbers.map(({ phoneNumber, phoneNumberId }) =>
      callPhoneNumber(phoneNumber, phoneNumberId, new Deferred()),
    ),
  );
  res.sendStatus(200);
});

app.post("/callStatus/:phoneNumberId", middleware.webhookLogger, (req, res) => {
  const phoneNumberId = Number(req.params.phoneNumberId);

  io.send({ status: req.body.status, phoneNumberId: phoneNumberId });

  // refactor opportunity
  if (activeCalls[phoneNumberId] && req.body.status === "completed") {
    const resolveCallCompletePromise = activeCalls[phoneNumberId];
    resolveCallCompletePromise();
  }

  res.sendStatus(200);
});

io.on("connection", (socket) => {
  console.log("Websocket connected!");
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = server;

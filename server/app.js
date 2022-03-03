require("dotenv").config();

const express = require("express");
const axios = require("axios");
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");

const runTasks = require("./utils/runTasks.js");

const app = express();

const phoneNumbers = [
  { phoneNumber: "13018040009", phoneNumberId: 1 },
  { phoneNumber: "19842068287", phoneNumberId: 2 },
  { phoneNumber: "15512459377", phoneNumberId: 3 },
  { phoneNumber: "19362072765", phoneNumberId: 4 },
  { phoneNumber: "18582210308", phoneNumberId: 5 },
  { phoneNumber: "13018040009", phoneNumberId: 6 },
  { phoneNumber: "19842068287", phoneNumberId: 7 },
  { phoneNumber: "15512459377", phoneNumberId: 8 },
  { phoneNumber: "19362072765", phoneNumberId: 9 },
];

app.use(cors());
app.use(express.json());
// app.use(middleware.requestLogger);

app.get("/phoneNumbers", (_, res) => {
  res.json(phoneNumbers);
});

const activeCalls = {
  // phoneNumberId: promiseExecutor,
};

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

const callPhoneNumber =
  (phoneNumber, phoneNumberId, callCompletePromise) => async () => {
    axios
      .post("http://localhost:4830/call", {
        phone: phoneNumber,
        webhookURL: `http://localhost:3001/callStatus/${phoneNumberId}`,
      })
      .then((response) => {
        if (response.status !== 200) return null;
        console.log(`Started calling phoneNumberId ${phoneNumberId}`);
        activeCalls[phoneNumberId] = () => {
          console.log(`Finished calling phoneNumberId ${phoneNumberId}`);
          callCompletePromise.resolve();
        };
      })
      .catch((e) => {
        throw new Error(e.code);
      });
    await callCompletePromise.promise;
  };

app.post("/callPhoneNumbers", (_, res) => {
  runTasks(
    phoneNumbers.map(({ phoneNumber, phoneNumberId }) => {
      const callCompletePromise = new Deferred();
      return callPhoneNumber(phoneNumber, phoneNumberId, callCompletePromise);
    }),
  );
  res.sendStatus(200);
});

app.post("/callStatus/:phoneNumberId", (req, res) => {
  const phoneNumberId = req.params.phoneNumberId;

  console.log(
    "Webhook | phoneNumberId: ",
    phoneNumberId,
    " Status: ",
    req.body.status,
  );

  if (activeCalls[phoneNumberId] && req.body.status === "completed") {
    const resolveCallCompletePromise = activeCalls[phoneNumberId];
    resolveCallCompletePromise();
  }
  res.sendStatus(200);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

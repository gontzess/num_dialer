require("dotenv").config();

const express = require("express");
const axios = require("axios");
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");

const runTasks = require("./utils/runTasks.js");

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
        console.log(`Started calling this number ${phoneNumberId}`);
        activeCalls[phoneNumberId] = () => {
          console.log(`Finished calling this number ${phoneNumberId}`);
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
    "From Webhook, Number Id: ",
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

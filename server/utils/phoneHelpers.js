const axios = require("axios");

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

const activeCalls = {
  // phoneNumberId: promiseExecutor,
};

const callPhoneNumber =
  (phoneNumber, phoneNumberId, callCompletePromise) => async () => {
    axios
      .post("http://localhost:4830/call", {
        phone: phoneNumber,
        webhookURL: `http://localhost:3001/callStatus/${phoneNumberId}`,
      })
      .catch((e) => {
        throw new Error(e.code);
      })
      .then((response) => {
        if (response.status !== 200) return null;
        console.log(`Started calling phoneNumberId ${phoneNumberId}`);
        activeCalls[phoneNumberId] = () => {
          console.log(`Finished calling phoneNumberId ${phoneNumberId}`);
          callCompletePromise.resolve();
        };
      });

    await callCompletePromise.promise;
  };

const checkIfCallCompleteAndResolve = (phoneNumberId, status) => {
  if (activeCalls[phoneNumberId] && status === "completed") {
    const resolveCallCompletePromise = activeCalls[phoneNumberId];
    resolveCallCompletePromise();
  }
};

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

module.exports = {
  phoneNumbers,
  callPhoneNumber,
  checkIfCallCompleteAndResolve,
  Deferred,
};

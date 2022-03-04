import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function App() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  useEffect(() => {
    axios
      .get("/phoneNumbers")
      .then((response) => setPhoneNumbers(response.data));
  }, []);

  const handleUpdateCallStatus = ({ status, phoneNumberId }) => {
    console.log(status, phoneNumberId);
    setPhoneNumbers((phoneNumbers) =>
      phoneNumbers.map((phoneNumber) => {
        if (
          phoneNumber.phoneNumberId === phoneNumberId &&
          phoneNumber.status !== "completed"
        ) {
          return { ...phoneNumber, status };
        } else {
          return phoneNumber;
        }
      }),
    );
  };

  useEffect(() => {
    const socket = io("/");
    socket.on("message", handleUpdateCallStatus);
    return () => socket.disconnect();
  }, []);

  const [callInitiated, setCallInitiated] = useState(false);
  const handleCallPhoneNumbers = () => {
    axios.post("/callPhoneNumbers").then((response) => {
      if (response.status === 200) setCallInitiated(true);
    });
  };

  return (
    <div>
      <h1>Phone Numbers</h1>
      <button onClick={handleCallPhoneNumbers} disabled={callInitiated}>
        Call
      </button>
      <ol>
        {phoneNumbers.map(({ phoneNumber, phoneNumberId, status }) => (
          <li key={phoneNumberId}>
            <p>Number: {phoneNumber}</p>
            <p>Status: {status ? status : "idle"}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;

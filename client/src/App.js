import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  useEffect(() => {
    axios
      .get("/phoneNumbers")
      .then((response) => setPhoneNumbers(response.data));
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
        {phoneNumbers.map(({ phoneNumber, phoneNumberId }) => (
          <li key={phoneNumberId}>
            <p>Number: {phoneNumber}</p>
            <p>Status: Idle</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;

import Login  from './components/Login';
import {useImmer} from 'use-immer';
import axios from './utils/Axios';
import socket from './utils/Socket';
import { useEffect, useState } from "react";
import { Device } from "twilio-client";

import CallCenter from "./components/CallCenter";
import useTokenFromLocalStorage from "./hooks/useTokenFromLocalStorage";
function App() {
  const [calls, setCalls] = useImmer({
    calls: [],
  });
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });

  // const [storedToken, setStoredToken] = useLocalStorage("token", null);
  const [twilioToken, setTwilioToken] = useState();
  const [storedToken, setStoredToken, isValidToken] =
    useTokenFromLocalStorage(null);

  useEffect(() => {
    console.log("Twilio Token Changed");
    if (twilioToken) {
      connectTwilioVoiceClient(twilioToken);
    }
  }, [twilioToken]);

  useEffect(() => {
    if (isValidToken) {
      return socket.addToken(storedToken);
    }
    socket.removeToken();
  }, [isValidToken, storedToken]);
  useEffect(() => {
    socket.client.on("connect", () => {
      console.log("Connection");
    });
    socket.client.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    socket.client.on("twilio-token", (data) => {
      setTwilioToken(data.token);
    });

    socket.client.on("call-new", (data) => {
      console.log("🚀 ~ file: App.js:26 ~ socket.on ~ data:", data);

      setCalls((draft) => {
        draft.calls.push(data);
      });
    });
    socket.client.on("enqueue", (data) => {
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          ({ callSid }) => callSid === data.callSid
        );
        draft.calls[index].data.CallStatus = "enqueue";
      });
    });
    return () => {};
  }, [socket.client]);
  async function sendSmsCode() {
    console.log("Sending SMS");
    await axios.post("/login", {
      to: user.mobileNumber,
      username: user.username,
      channel: "sms",
    });
    setUser((draft) => {
      draft.verificationSent = true;
    });
  }
  const sendVerificationCode = async () => {
    console.log("Sending Verification Code.");
    const response = await axios.post("/verify", {
      to: user.mobileNumber,
      code: user.verificationCode,
      username: user.username,
    });
    console.log("Received token.", response.data.token);
    setStoredToken(response.data.token);
  };
  const connectTwilioVoiceClient = (twilioToken) => {
    const device = new Device(twilioToken, { debug: true });
    device.on("error", (error) => {
      console.error(error);
    });
    device.on("incoming", (connection) => {
      console.log("Incoming from Twilio");
      connection.accept();
    });
  };
  return (
    <div className="App">
      {isValidToken ? (
        <CallCenter username={user.username} calls={calls} />
      ) : (
        <>
          <Login
            user={user}
            setUser={setUser}
            sendSmsCode={sendSmsCode}
            sendVerificationCode={sendVerificationCode}
          />
        </>
      )}
    </div>
  );
}

export default App;

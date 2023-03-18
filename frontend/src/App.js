import Login  from './components/Login';
import {useImmer} from 'use-immer';
import axios from './utils/Axios';
import socket from './utils/Socket';
import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import CallCenter from "./components/CallCenter";
function App() {
  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });

  const [storedToken, setStoredToken] = useLocalStorage("token", null);

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
    return () => {};
  }, []);
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
  return (
    <div className="App">
      {storedToken ? (
        <CallCenter username={user.username} />
      ) : (
        <Login
          user={user}
          setUser={setUser}
          sendSmsCode={sendSmsCode}
          sendVerificationCode={sendVerificationCode}
        />
      )}
    </div>
  );
}

export default App;

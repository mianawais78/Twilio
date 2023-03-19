import React from "react";
import CallProgress from "./CallProgress";
import NavBar from "./Navbar";

const CallCenter = (props) => {
  console.log("Hello", props);
  return (
    <div>
      <NavBar username={props.username}></NavBar>
      {props.calls.calls.map((call) => (
        <CallProgress call={call}></CallProgress>
      ))}
    </div>
  );
};

export default CallCenter;

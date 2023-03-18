import React from "react";
import CallProgress from "./CallProgress";
import NavBar from "./Navbar";

const CallCenter = (props) => {
  return (
    <div>
      <NavBar username={props.username}></NavBar>
      <CallProgress></CallProgress>
    </div>
  );
};

export default CallCenter;

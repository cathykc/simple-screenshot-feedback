import React, { useState } from "react";

import DemoOptions from "./DemoOptions";
import Feedback from "../../src";

export default function App() {
  const [location, setLocation] = useState("top-right");
  const [slackToken, setSlackToken] = useState("");
  const [slackChannel, setSlackChannel] = useState("");

  const handleSubmitError = (err: Error) => {
    console.error(err);
  }

  const handleLocation = (newLocation) => {
    setLocation(newLocation);
  }

  const handleSlackToken = (newToken) => {
    setSlackToken(newToken);
  }

  const handleSlackChannel = (newChannel) => {
    setSlackChannel(newChannel);
  }

  return (
    <>
      <DemoOptions
        handleLocation={handleLocation}
        handleSlackToken={handleSlackToken}
        handleSlackChannel={handleSlackChannel}
      />
      <Feedback
        slackToken={slackToken}
        slackChannel={slackChannel}
        handleSubmitError={handleSubmitError}
        location={location}
      />
    </>
  )
}
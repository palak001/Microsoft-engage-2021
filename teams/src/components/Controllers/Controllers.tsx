import { Icon, initializeIcons, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";

const Controllers: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  initializeIcons();
  return (
    <Stack
      horizontal
      horizontalAlign="space-around"
      style={{
        position: "absolute",
        top: "95%",
        left: "40%",
        right: "40%",
        backgroundColor: "teal",
      }}
    >
      <Stack>
        <Icon
          iconName={"Microphone"}
          style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
          onClick={() => {
            context.toggleAudioSettings();
            console.log("getVideoTracks: ", context.stream);
          }}
        />
        {/* <Icon
          iconName={"MicOff2"}
          style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
        /> */}
      </Stack>
      <Stack>
        <Icon
          iconName={"Camera"}
          style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
          onClick={() => {
            context.toggleVideoSettings();
            console.log("getVideoTracks: ", context.stream);
          }}
        />
      </Stack>
      <Stack>
        <Icon
          onClick={() => {
            context.leaveCall();
          }}
          iconName={"DeclineCall"}
          style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
        />
      </Stack>
    </Stack>
  );
};

export default Controllers;

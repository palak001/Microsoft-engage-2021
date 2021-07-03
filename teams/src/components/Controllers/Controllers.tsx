import { Icon, initializeIcons, Stack } from "@fluentui/react";
import React, { useContext, useState } from "react";
import { SocketContext } from "../../SockectContext";

const Controllers: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  initializeIcons();
  const [toggleMic, setToggleMic] = useState<boolean>(true);
  const [toggleCam, setToggleCam] = useState<boolean>(true);
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
        {toggleMic ? (
          <Icon
            iconName={"Microphone"}
            style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
            onClick={() => {
              context.toggleAudioSettings();
              setToggleMic(!toggleMic);
            }}
          />
        ) : (
          <Icon
            iconName={"MicOff2"}
            style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
            onClick={() => {
              context.toggleAudioSettings();
              setToggleMic(!toggleMic);
            }}
          />
        )}
      </Stack>
      <Stack>
        {toggleCam ? (
          <Icon
            iconName={"Video"}
            style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
            onClick={() => {
              context.toggleVideoSettings();
              setToggleCam(!toggleCam);
            }}
          />
        ) : (
          <Icon
            iconName={"VideoOff"}
            style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
            onClick={() => {
              context.toggleVideoSettings();
              setToggleCam(!toggleCam);
            }}
          />
        )}
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

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
      }}
    >
      <Stack>
        <Icon
          iconName={"Microphone"}
          style={{ color: "white", fontSize: "25px", cursor: "pointer" }}
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

import { Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { ChatRoomHeader } from "../ChatRoomHeader/ChatRoomHeader";
import Video from "../Video/Video";

import { SocketContext } from "../../SockectContext";

export const ChatRoom: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  return (
    <Stack
      verticalAlign="center"
      style={{
        width: "77%",
        boxShadow:
          "0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0px 0.6px 1.8px rgba(0, 0, 0, 0.108)",
        backgroundColor: "#F6F5F4",
      }}
    >
      <ChatRoomHeader />
      <Video />
      <Stack>{context.callDetails?.from} is calling you</Stack>
      <Stack
        style={{
          height: "93.25%",
        }}
      ></Stack>
    </Stack>
  );
};

import { Stack } from "@fluentui/react";
import React from "react";
import { ChatRoomHeader } from "../ChatRoomHeader/ChatRoomHeader";
import { Video } from "../Video/Video";

export const ChatRoom: React.FunctionComponent = () => {
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
      <Stack
        style={{
          height: "93.25%",
        }}
      ></Stack>
    </Stack>
  );
};

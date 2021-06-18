import { Stack } from "@fluentui/react";
import React from "react";
import { ChatRoomHeader } from "../ChatRoomHeader/ChatRoomHeader";

export const ChatRoom: React.FunctionComponent = () => {
  return (
    <>
      <ChatRoomHeader />
      <Stack
        style={{
          height: "93.25%",
        }}
      ></Stack>
    </>
  );
};

import { initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { SideBar } from "../SideBar/SideBar";
import { ChatList } from "../ChatList/ChatList";
import { MainBodyStackProps } from "./MainBody.styles";
import { ChatRoom } from "../ChatRoom/ChatRoom";

export const MainBody: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack {...MainBodyStackProps}>
      <Stack style={{ width: "23%" }} horizontal>
        <SideBar />
        <ChatList />
      </Stack>
      <Stack
        verticalAlign="center"
        style={{
          width: "77%",
          boxShadow:
            "0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0px 0.6px 1.8px rgba(0, 0, 0, 0.108)",
          backgroundColor: "#F6F5F4",
        }}
      >
        <ChatRoom />
      </Stack>
    </Stack>
  );
};

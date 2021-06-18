import { initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { SideBar } from "../SideBar/SideBar";
import { ChatList } from "../ChatList/ChatList";
import { MainBodyStackProps } from "./MainBody.styles";
import { ChatRoom } from "../ChatRoom/ChatRoom";
import { Video } from "../Video/Video";

export const MainBody: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack {...MainBodyStackProps}>
      <Stack style={{ width: "23%" }} horizontal>
        <SideBar />
        <ChatList />
      </Stack>
      <Video />
      {/* <ChatRoom /> */}
    </Stack>
  );
};

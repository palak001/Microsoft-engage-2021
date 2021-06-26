import { initializeIcons, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SideBar } from "../SideBar/SideBar";
import { ChatList } from "../ChatList/ChatList";
import { MainBodyStackProps } from "./MainBody.styles";
import { ChatRoom } from "../ChatRoom/ChatRoom";
import { SocketContext } from "../../SockectContext";
import Video from "../Video/Video";

export const MainBody: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  initializeIcons();
  return (
    <Stack {...MainBodyStackProps}>
      <Stack style={{ width: "23%" }} horizontal>
        <SideBar />
        <ChatList />
      </Stack>
      {context.callStarted || context.callAccepted ? <Video /> : <ChatRoom />}
    </Stack>
  );
};

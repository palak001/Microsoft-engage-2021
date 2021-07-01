import { initializeIcons, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { ChatList } from "../ChatList/ChatList";
import { MainBodyStackProps } from "./MainBody.styles";
import { ChatRoom } from "../ChatRoom/ChatRoom";
import { SocketContext } from "../../SockectContext";
import Video from "../Video/Video";
import { CallNotification } from "../CallNotification/CallNotification";
import { ChatRoomHeader } from "../ChatRoomHeader/ChatRoomHeader";

export const MainBody: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  initializeIcons();
  return (
    <Stack {...MainBodyStackProps}>
      {/* {context.callStarted || context.callAccepted ? ( */}
      <Stack verticalFill>
        <ChatList />
      </Stack>
      <Stack style={{ height: "6.4%" }}>
        <ChatRoomHeader />
      </Stack>
      <Stack style={{ height: "100%", width: "100%" }}>
        <Video />
      </Stack>
      {/* ) : (
        <>
          <Stack style={{ width: "15%" }}>
            <Stack verticalFill>
              <ChatList />
            </Stack>
          </Stack>
          <Stack verticalFill style={{ width: "85%" }}>
            <ChatRoom />
          </Stack>
        </>
      )} */}

      {context.gettingCall && !context.callAccepted && context.callDetails ? (
        <Stack style={{ height: "10%", width: "10%" }}>
          <CallNotification />
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );
};

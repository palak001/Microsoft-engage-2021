import { ChatRoomHeader } from "../ChatRoomHeader/ChatRoomHeader";
import { TextField } from "@fluentui/react/lib/TextField";
import { IStackProps, Stack } from "@fluentui/react";
import React from "react";

const columnProps: Partial<IStackProps> = {
  styles: { root: { width: "85%", height: "7%" } },
};

export const ChatRoom: React.FunctionComponent = () => {
  return (
    <Stack verticalFill verticalAlign="center" style={{ width: "100%" }}>
      <Stack style={{ height: "6.4%" }}>
        <ChatRoomHeader />
      </Stack>
      <Stack horizontalAlign="center" style={{ height: "93.6%" }}>
        <Stack style={{ height: "93%" }}></Stack>
        <Stack {...columnProps}>
          <TextField placeholder="Type your message " underlined />
        </Stack>
      </Stack>
    </Stack>
  );
};

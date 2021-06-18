import { Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";
import { StackProps } from "./Video.styles";

export const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  return (
    <Stack horizontal>
      <Stack {...StackProps}>
        <video playsInline ref={context.yourVideo} muted autoPlay />
      </Stack>
      <Stack {...StackProps}>
        <video playsInline ref={context.friendVideo} muted autoPlay />
      </Stack>
    </Stack>
  );
};
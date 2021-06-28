import { Stack } from "@fluentui/react";
import * as React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { SocketContext } from "../../SockectContext";

export const CallNotification: React.FunctionComponent = () => {
  const context = React.useContext(SocketContext);
  return (
    <Stack>
      <Text>{context.callDetails.from} calling you...</Text>
      <button onClick={context.answerCall}>Accept</button>
      <button onClick={context.leaveCall}>Decline</button>
    </Stack>
  );
};

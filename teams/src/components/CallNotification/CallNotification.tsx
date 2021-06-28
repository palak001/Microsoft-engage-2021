import {
  DefaultButton,
  IStackTokens,
  Persona,
  PersonaSize,
  Stack,
} from "@fluentui/react";
import * as React from "react";
import { Text } from "@fluentui/react/lib/Text";
import { SocketContext } from "../../SockectContext";

const stackTokens: IStackTokens = { childrenGap: 40 };

export const CallNotification: React.FunctionComponent = () => {
  const context = React.useContext(SocketContext);
  console.log("callDetails:", context.callDetails);
  return (
    <Stack
      verticalAlign="space-around"
      horizontalAlign="center"
      style={{
        position: "absolute",
        top: "70%",
        left: "80%",
        width: "20%",
        height: "30%",
        background: "black",
        // opacity: "0.75",
        color: "#FFFFFF",
      }}
    >
      <Stack horizontalAlign="center">
        <Persona
          imageUrl={context.callDetails.photoURL}
          size={PersonaSize.size56}
          // presence={PersonaPresence.online}
          imageAlt="Palak, status is online"
        />
        <Text style={{ color: "white" }} variant={"xLarge"}>
          {context.callDetails.name} is calling...
        </Text>
      </Stack>

      <Stack horizontal tokens={stackTokens}>
        <DefaultButton
          style={{ backgroundColor: "#4DAA57", color: "white" }}
          text="Accept"
          onClick={context.answerCall}
          allowDisabledFocus
        />
        <DefaultButton
          text="Decline"
          onClick={context.leaveCall}
          allowDisabledFocus
          style={{ backgroundColor: "#D1462F", color: "white" }}
        />
      </Stack>
    </Stack>
  );
};

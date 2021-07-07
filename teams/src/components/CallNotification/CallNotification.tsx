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
import { useHistory } from "react-router";
import { auth } from "../../config/firebase";

const stackTokens: IStackTokens = { childrenGap: 40 };

export const CallNotification: React.FunctionComponent = () => {
  const context = React.useContext(SocketContext);
  const history = useHistory();

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
        background: "#FAFAFA",
        // opacity: "0.75",
        color: "#1C1C1C",
      }}
    >
      <Stack horizontalAlign="center">
        <Persona
          imageUrl={context.callDetails.photoURL}
          size={PersonaSize.size56}
          // presence={PersonaPresence.online}
          imageAlt="Palak, status is online"
        />
        <Text style={{ color: "#1C1C1C" }} variant={"xLarge"}>
          {context.callDetails.name} is calling...
        </Text>
      </Stack>

      <Stack horizontal tokens={stackTokens}>
        <DefaultButton
          style={{ backgroundColor: "#0064BF", color: "white" }}
          text="Accept"
          onClick={() => {
            context.getUserMediaFunction();
            context.setAcceptingCallToTrue();
            history.push(
              `/meeting?uid1=${
                auth.currentUser?.uid
              }&uid2=${"uidOfEmail"}&meetingID=${"meetingID"}`
            );
          }}
          allowDisabledFocus
        />
        <DefaultButton
          text="Decline"
          onClick={context.rejectCall}
          allowDisabledFocus
          style={{ backgroundColor: "#d74654", color: "white", border: "none" }}
        />
      </Stack>
    </Stack>
  );
};

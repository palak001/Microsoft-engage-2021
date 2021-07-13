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
import "../MediaQueryStyles.css";
import { callWidget } from "../Styles";

const stackTokens: IStackTokens = { childrenGap: 40 };

export const CallNotification: React.FunctionComponent = () => {
  const context = React.useContext(SocketContext);
  const history = useHistory();

  return (
    <Stack className="callNotification-class" {...callWidget}>
      <Stack horizontalAlign="center">
        <Text variant={"xxLarge"}>{context.callDetails.meetingName}</Text>{" "}
        <br></br>
        <Persona
          imageUrl={context.callDetails.photoURL}
          size={PersonaSize.size56}
          imageAlt="Palak, status is online"
        />
        <Text style={{ color: "#1C1C1C" }} variant={"xLarge"}>
          {context.callDetails.name} is calling...
        </Text>
        <br />
      </Stack>

      <Stack horizontal tokens={stackTokens}>
        <DefaultButton
          style={{ backgroundColor: "#0064BF", color: "white" }}
          text="Accept"
          onClick={() => {
            // Get user's media and direct them to proper link
            context.getUserMediaFunction();
            context.setAcceptingCallToTrue();
            history.push(
              `/meeting?uid1=${auth.currentUser?.uid}&uid2=${context.callDetails.uid}&meetingID=${context.callDetails.meetingID}`
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

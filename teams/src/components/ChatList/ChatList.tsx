import { Icon, initializeIcons, IStackTokens, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { auth } from "../../config/firebase";
import { SocketContext } from "../../SockectContext";
import { Contacts } from "../Contacts/Contacts";
import { IconProps } from "../MainBody/MainBody.styles";
import { Text } from "@fluentui/react/lib/Text";

import { DefaultButton } from "@fluentui/react/lib/Button";

const stackTokens: IStackTokens = { childrenGap: 40 };

export const ChatList: React.FunctionComponent = () => {
  const history = useHistory();
  const context = useContext(SocketContext);
  initializeIcons();

  const handleSignOut = () => {
    auth.signOut().then(() => {
      history.push("/signup");
    });
  };

  return (
    <Stack
      verticalFill
      style={{
        borderRight: "1px solid #646464",
      }}
    >
      {/* heading */}
      <Stack
        horizontalAlign="space-between"
        horizontal
        verticalAlign="center"
        style={{
          padding: "12px",
          height: "6.4%",
          borderBottom: "0.2px #D2D7DF solid",
        }}
      >
        <Text variant={"xLarge"}>Chat</Text>
        <Icon iconName={"Add"} style={{ fontSize: "15px" }} {...IconProps} />
      </Stack>
      {/* contacts */}
      <Stack
        style={{
          // padding: "12px",
          height: "93.6%",
        }}
      >
        {/* <Stack>
          <Stack>
            <h4>Current User:</h4> {auth.currentUser?.email}
          </Stack>
          <Stack>
            <h4>SocketID:</h4> {context.yourID}
          </Stack>
        </Stack> */}

        {/* <Stack>
          <Stack horizontal tokens={stackTokens}>
            <DefaultButton
              style={{ backgroundColor: "#ECEDE8" }}
              text="Sign out"
              onClick={() => {
                handleSignOut();
              }}
              allowDisabledFocus
            />
          </Stack>
        </Stack> */}
        <Contacts />
      </Stack>
    </Stack>
  );
};

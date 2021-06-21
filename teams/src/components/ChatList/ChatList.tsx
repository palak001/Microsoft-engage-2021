import { Icon, initializeIcons, IStackTokens, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import { auth } from "../../config/firebase";
import { SocketContext } from "../../SockectContext";
import { Contacts } from "../Contacts/Contacts";
import { IconProps } from "../MainBody/MainBody.styles";

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
      style={{
        width: "85%",
        boxShadow:
          "0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0px 0.6px 1.8px rgba(0, 0, 0, 0.108)",
      }}
    >
      {/* heading */}
      <Stack
        horizontalAlign="space-between"
        horizontal
        verticalAlign="center"
        style={{
          paddingLeft: "12px",
          borderBottom: "0.2px #D2D7DF solid",
        }}
      >
        <h3>Chat</h3>
        <Icon
          iconName={"Favicon"}
          style={{ fontSize: "15px" }}
          {...IconProps}
        />
      </Stack>
      {/* contacts */}
      <Stack>
        <Stack>
          <Stack>
            <h4>Current User:</h4> {auth.currentUser?.email}
          </Stack>
          <Stack>
            <h4>SocketID:</h4> {context.yourID}
          </Stack>
        </Stack>

        <Stack>
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
        </Stack>
        <Contacts />
      </Stack>
    </Stack>
  );
};

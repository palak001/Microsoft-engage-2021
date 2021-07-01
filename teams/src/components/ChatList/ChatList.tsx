import { Icon, initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { Contacts } from "../Contacts/Contacts";
import { IconProps } from "../MainBody/MainBody.styles";
import { Text } from "@fluentui/react/lib/Text";

export const ChatList: React.FunctionComponent = () => {
  initializeIcons();

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
        <Icon
          iconName={"ChevronDown"}
          {...IconProps}
          style={{ fontSize: "14px", color: "black" }}
        />
      </Stack>
      {/* contacts */}
      <Stack
        style={{
          // padding: "12px",
          height: "93.6%",
        }}
      >
        <Stack>
          {/* <Stack>
            <h4>SocketID:</h4> {context.yourID}
          </Stack> */}
        </Stack>

        <Contacts />
      </Stack>
    </Stack>
  );
};

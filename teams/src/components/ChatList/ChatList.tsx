import { Icon, initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { Contacts } from "../Contacts/Contacts";
import { IconProps } from "../MainBody/MainBody.styles";

export const ChatList: React.FunctionComponent = () => {
  initializeIcons();
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
        <Contacts />
      </Stack>
    </Stack>
  );
};

import { Icon, initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { IconProps, SideBarStackProps } from "./SideBar.styles";

export const SideBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack horizontal {...SideBarStackProps}>
      {/* left */}
      <Stack horizontal style={{ width: "23%", backgroundColor: "#ECEDE8" }}>
        {/* icons */}
        <Stack
          horizontalAlign="center"
          style={{ width: "15%", fontSize: "10px", color: "grey" }}
        >
          <Icon iconName={"Phone"} {...IconProps} />
          Phone
          <Icon iconName={"Chat"} {...IconProps} />
          Chat
          <Icon iconName={"Group"} {...IconProps} />
          Teams
        </Stack>
        {/* recents */}
        <Stack
          style={{
            width: "85%",
            paddingLeft: "12px",
            boxShadow:
              "0 4px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          {/* heading */}
          <Stack
            horizontalAlign="space-between"
            horizontal
            verticalAlign="center"
          >
            <h3>Chat</h3>
            <Icon
              iconName={"Favicon"}
              style={{ fontSize: "15px" }}
              {...IconProps}
            />
          </Stack>
          {/* contacts */}
          <Stack></Stack>
        </Stack>
      </Stack>
      {/* right */}
      <Stack
        verticalAlign="center"
        style={{
          width: "77%",
          boxShadow:
            "0 4px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 8px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        {/* To */}
        <Stack
          verticalAlign="center"
          style={{
            height: "7%",
            width: "100%",
            paddingLeft: "30px",
            fontSize: "13px",
            color: "grey",
          }}
        >
          To: Enter email
        </Stack>
        {/* chat box */}
        <Stack style={{ height: "93%", backgroundColor: "#F6F5F4" }}></Stack>
      </Stack>
    </Stack>
  );
};

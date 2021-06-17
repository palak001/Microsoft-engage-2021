import { initializeIcons, Stack } from "@fluentui/react";
import React from "react";
import { SideBar } from "../SideBar/SideBar";
import { Chat } from "../Chat/Chat";
import { MainBodyStackProps } from "./MainBody.styles";

export const MainBody: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack {...MainBodyStackProps}>
      <Stack
        style={{
          width: "23%",
        }}
        horizontal
      >
        <SideBar />
        <Chat />
      </Stack>
      <Stack
        verticalAlign="center"
        style={{
          width: "77%",
          boxShadow:
            "0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0px 0.6px 1.8px rgba(0, 0, 0, 0.108)",
          backgroundColor: "#F6F5F4",
        }}
      >
        <Stack
          verticalAlign="center"
          style={{
            height: "6.75%",
            width: "100%",
            paddingLeft: "30px",
            fontSize: "13px",
            color: "grey",
            borderBottom: "0.2px #D2D7DF solid",
          }}
        >
          To: Enter email
        </Stack>
        <Stack
          style={{
            height: "93.25%",
          }}
        ></Stack>
      </Stack>
    </Stack>
  );
};

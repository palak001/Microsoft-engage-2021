import { Stack } from "@fluentui/react";
import React from "react";
import { NavBar } from "../../components/Navbar/NavBar";
import { MainBody } from "../../components/MainBody/MainBody";
import { MainPageStackProps } from "./MainPage.style";

export const MainPage: React.FunctionComponent = () => {
  return (
    <div>
      <Stack {...MainPageStackProps} style={{ height: "100vh" }}>
        <Stack style={{ height: "9%" }}>
          <NavBar />
        </Stack>
        <Stack style={{ height: "91%", width: "100%" }}>
          <MainBody />
        </Stack>
      </Stack>
    </div>
  );
};

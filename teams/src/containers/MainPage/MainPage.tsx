import { Stack } from "@fluentui/react";
import React from "react";
import { NavBar } from "../../components/Navbar/NavBar";
import { MainBody } from "../../components/MainBody/MainBody";
// import Videocall from "../../services/VideoCall/Videocall";
import { MainPageStackProps } from "./MainPage.style";

export const MainPage: React.FunctionComponent = () => {
  return (
    <div>
      <Stack {...MainPageStackProps} style={{ height: "100vh" }}>
        <NavBar />
        <Stack verticalFill={true}>
          <MainBody />
        </Stack>
      </Stack>

      {/* <Videocall /> */}
    </div>
  );
};

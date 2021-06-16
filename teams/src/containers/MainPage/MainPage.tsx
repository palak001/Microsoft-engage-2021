import { Stack } from "@fluentui/react";
import React from "react";
import { NavBar } from "../../components/Navbar/NavBar";
import { SideBar } from "../../components/SideBar/SideBar";
import Videocall from "../../services/VideoCall/Videocall";
import { MainPageStackProps } from "./MainPage.style";

export const MainPage: React.FunctionComponent = () => {
  return (
    <div>
      {/* <Stack {...MainPageStackProps} style={{ height: "100vh" }}> */}
      <NavBar />
      {/* <Stack verticalFill={true}>
        <SideBar />
      </Stack> */}
      {/* </Stack> */}

      <Videocall />
    </div>
  );
};

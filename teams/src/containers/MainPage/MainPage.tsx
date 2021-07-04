import { Stack } from "@fluentui/react";
import React from "react";
import { MainPageStackProps } from "./MainPage.style";
import { HomeComponent } from "../../components/HomeComponent";

export const MainPage: React.FunctionComponent = () => {
  return (
    <div>
      <Stack {...MainPageStackProps} style={{ height: "100vh" }}>
        <HomeComponent />{" "}
        {/* <MeetingComponent
          {...{
            cameraPermission: "Denied",
            cameraActive: true,
            micActive: true,
            microphonePermission: "Denied",
          }}
        /> */}
      </Stack>
    </div>
  );
};

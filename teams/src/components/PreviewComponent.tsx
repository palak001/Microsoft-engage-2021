import React, { useContext, useState } from "react";
import { IStackProps, PrimaryButton, Stack, Toggle } from "@fluentui/react";
import {
  MicIcon,
  CallVideoIcon,
  MicOffIcon,
  CallVideoOffIcon,
} from "@fluentui/react-icons-northstar";
import { SocketContext } from "../SockectContext";

const previewStackProps: IStackProps = {
  tokens: {
    padding: "50px",
    childrenGap: "20px",
  },
  verticalAlign: "center",
  horizontalAlign: "center",
  styles: {
    root: {
      height: "60%",
      width: "35%",
      backgroundColor: "#FFFFFF",
      border: "0.5px solid #E5E5E5",
      boxSizing: "border-box",
      boxShadow:
        "0px 1.6px 3.6px rgba(0, 0, 0, 0.132), 0px 0.3px 0.9px rgba(0, 0, 0, 0.108)",
      borderRadius: "4px",
    },
  },
};

export const PreviewComponent: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  const [toggleMicStatus, setToggleMicStatus] = useState<string>("on");
  const [toggleCamStatus, setToggleCamStatus] = useState<string>("on");

  const handleOnCamToggle = () => {
    toggleCamStatus === "on"
      ? setToggleCamStatus("off")
      : setToggleCamStatus("on");
  };

  const handleOnMicToggle = () => {
    toggleMicStatus === "on"
      ? setToggleMicStatus("off")
      : setToggleMicStatus("on");
  };

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      style={{ height: "100%" }}
    >
      <Stack {...previewStackProps}>
        <Stack style={{ height: "90%", width: "100%" }}>
          <video
            width="100%"
            height="100%"
            playsInline
            ref={context.yourVideo}
            style={{ objectFit: "cover" }}
            autoPlay
          />
        </Stack>
        <Stack horizontal horizontalAlign="center" style={{ width: "100%" }}>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ padding: "12px", childrenGap: "5px" }}
          >
            <Stack style={{ width: "30px" }}>
              {toggleCamStatus === "on" ? (
                <CallVideoIcon size="smaller" />
              ) : (
                <CallVideoOffIcon size="smaller" />
              )}
            </Stack>
            <Stack>
              <Toggle
                defaultChecked
                onChange={handleOnCamToggle}
                ariaLabel="Video Icon"
              />
            </Stack>
          </Stack>
          <Stack horizontal verticalAlign="center" tokens={{ padding: "10px" }}>
            <Stack style={{ width: "30px" }}>
              {toggleMicStatus === "on" ? (
                <MicIcon size="smaller" />
              ) : (
                <MicOffIcon size="smaller" />
              )}
            </Stack>
            <Stack>
              <Toggle
                defaultChecked
                ariaLabel="Microphone Icon"
                onChange={handleOnMicToggle}
              />
            </Stack>
            <Stack verticalAlign="center" tokens={{ padding: "10px" }}>
              <PrimaryButton text="Sign out" allowDisabledFocus />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

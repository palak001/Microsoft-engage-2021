import React, { useContext, useState } from "react";
import {
  IStackProps,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Toggle,
} from "@fluentui/react";
import {
  MicIcon,
  CallVideoIcon,
  MicOffIcon,
  CallVideoOffIcon,
} from "@fluentui/react-icons-northstar";
import { SocketContext } from "../SockectContext";
import FirebaseUser from "../interfaces/user.interface";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store";

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
  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  );
  const mediaStreamError: string = useSelector(
    (state: RootState) => state.mediaStreamErrorReducer.mediaStreamError
  );

  const [toggleMicStatus, setToggleMicStatus] = useState<string>("on");
  const [toggleCamStatus, setToggleCamStatus] = useState<string>("on");

  const handleOnCamToggle = () => {
    toggleCamStatus === "on"
      ? setToggleCamStatus("off")
      : setToggleCamStatus("on");
    context.toggleVideoSettings();
  };

  const handleOnMicToggle = () => {
    toggleMicStatus === "on"
      ? setToggleMicStatus("off")
      : setToggleMicStatus("on");
    context.toggleAudioSettings();
  };

  const handleJoin = () => {
    console.log("enteredUserDetails.socketID: ", enteredUserDetails.socketID);
    if (context.acceptingCall) {
      context.answerCall();
    } else context.startCall(enteredUserDetails.socketID);
  };

  return (
    <>
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        style={{ height: "100%" }}
      >
        <Stack tokens={{ padding: "0px 0px 30px 0px" }}>
          {mediaStreamError ? (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              {mediaStreamError}
            </MessageBar>
          ) : (
            ""
          )}
        </Stack>
        <Stack {...previewStackProps}>
          <Stack style={{ height: "90%", width: "100%" }}>
            <video
              width="100%"
              height="100%"
              playsInline
              ref={context.yourVideo}
              style={{ objectFit: "cover" }}
              poster={enteredUserDetails.photoURL}
              autoPlay
            />
          </Stack>
          <Stack horizontal horizontalAlign="center" style={{ width: "100%" }}>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ padding: "12px", childrenGap: "5px" }}
            >
              <Stack verticalAlign="center" style={{ width: "30px" }}>
                {toggleCamStatus === "on" ? (
                  <CallVideoIcon size="smaller" />
                ) : (
                  <CallVideoOffIcon size="smaller" />
                )}
              </Stack>
              <Stack verticalAlign="center">
                <Toggle
                  defaultChecked
                  onChange={handleOnCamToggle}
                  ariaLabel="Video Icon"
                />
              </Stack>
            </Stack>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ padding: "10px" }}
            >
              <Stack verticalAlign="center" style={{ width: "30px" }}>
                {toggleMicStatus === "on" ? (
                  <MicIcon size="smaller" />
                ) : (
                  <MicOffIcon size="smaller" />
                )}
              </Stack>
              <Stack verticalAlign="center">
                <Toggle
                  defaultChecked
                  ariaLabel="Microphone Icon"
                  onChange={handleOnMicToggle}
                />
              </Stack>
              <Stack verticalAlign="center" tokens={{ padding: "20px" }}>
                <PrimaryButton
                  text="Join"
                  allowDisabledFocus
                  onClick={handleJoin}
                />
              </Stack>
            </Stack>
            <Stack verticalAlign="center" tokens={{ padding: "10px" }}>
              <PrimaryButton
                text="Leave"
                allowDisabledFocus
                onClick={context.leaveCall}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

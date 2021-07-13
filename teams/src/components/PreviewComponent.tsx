import React, { useContext, useState } from "react";
import {
  Icon,
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-store";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { setControlsAction } from "../redux-store/Video/ControlsReducer";
import "./MediaQueryStyles.css";

const previewStackProps: IStackProps = {
  // verticalAlign: "center",
  // horizontalAlign: "center",
  styles: {
    root: {
      height: "400px",
      width: "400px",
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
  const dispatch = useDispatch();
  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  );
  const mediaStreamError: string = useSelector(
    (state: RootState) => state.mediaStreamErrorReducer.mediaStreamError
  );
  const history = useHistory();

  const [toggleMicStatus, setToggleMicStatus] = useState<string>("on");
  const [toggleCamStatus, setToggleCamStatus] = useState<string>("on");
  const [disableIcons, setDisableIcons] = useState<boolean>(true);

  useEffect(() => {
    // keep btn disabled till we receive users media or get an error for the same
    if (context.stream || mediaStreamError) {
      setDisableIcons(false);
    }
  }, [context.stream, mediaStreamError]);

  // Handle cam/mic toggle

  const handleOnCamToggle = () => {
    if (toggleCamStatus === "on") {
      dispatch(setControlsAction({ camera: "off", mic: toggleMicStatus }));
    } else {
      dispatch(setControlsAction({ camera: "on", mic: toggleMicStatus }));
    }
    toggleCamStatus === "on"
      ? setToggleCamStatus("off")
      : setToggleCamStatus("on");
    context.toggleVideoSettings();
  };

  const handleOnMicToggle = () => {
    if (toggleMicStatus === "on") {
      dispatch(setControlsAction({ mic: "off", camera: toggleCamStatus }));
    } else {
      dispatch(setControlsAction({ mic: "on", camera: toggleCamStatus }));
    }
    toggleMicStatus === "on"
      ? setToggleMicStatus("off")
      : setToggleMicStatus("on");
    context.toggleAudioSettings();
  };

  // Handle call join
  const handleJoin = () => {
    // console.log("enteredUserDetails.socketID: ", enteredUserDetails.socketID);
    if (context.acceptingCall) {
      context.answerCall();
    } else context.startCall(enteredUserDetails.socketID);
  };

  return (
    <Stack style={{ height: "100%" }}>
      {/* Back Icon */}
      <Stack
        horizontalAlign="start"
        verticalAlign="center"
        style={{ height: "10%" }}
        tokens={{ padding: "30px, 40px, 120px, 40px" }}
      >
        <Icon
          iconName="Back"
          style={{ cursor: "pointer", fontWeight: "bolder" }}
          onClick={() => {
            context.stopMediaTracks();
            history.push("/");
          }}
        />
      </Stack>

      {/* Main preview screen  */}
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        style={{ height: "90%", width: "100%" }}
      >
        <Stack
          style={{ height: "5%", width: "60%" }}
          tokens={{ padding: "0px 0px 20px 0px" }}
        >
          {/* Show error in case of mistake  */}
          {mediaStreamError ? (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              {mediaStreamError}
            </MessageBar>
          ) : (
            <></>
          )}
        </Stack>
        <Stack {...previewStackProps} className="previewStack-class">
          {/* User's video  */}
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            tokens={{ padding: "20px" }}
            style={{ height: "80%" }}
          >
            <video
              width="100%"
              height="100%"
              playsInline
              ref={context.yourVideo}
              style={{ objectFit: "cover" }}
              poster={auth.currentUser?.photoURL!}
              autoPlay
            />
          </Stack>
          {/* Cam controls  */}
          <Stack
            horizontal
            horizontalAlign="center"
            style={{ width: "100%" }}
            tokens={{ padding: "10px" }}
          >
            <Stack verticalAlign="center" style={{ width: "15px" }}>
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
                disabled={disableIcons}
              />
            </Stack>
            {/* Mic controls  */}
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ padding: "10px" }}
            >
              <Stack verticalAlign="center" style={{ width: "15px" }}>
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
                  disabled={disableIcons}
                />
              </Stack>
            </Stack>
            {/* Join btn  */}
            <Stack verticalAlign="center" tokens={{ padding: "10px" }}>
              <PrimaryButton
                text="Join"
                allowDisabledFocus
                onClick={handleJoin}
                disabled={disableIcons}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

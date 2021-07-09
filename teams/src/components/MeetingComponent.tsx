import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import { headerProps, personaLayoutProps, declineCallProps } from "./Styles";
import {
  MicIcon,
  MicOffIcon,
  CallVideoIcon,
  CallVideoOffIcon,
} from "@fluentui/react-icons-northstar";
import { auth } from "../config/firebase";
import { SocketContext } from "../SockectContext";
import Video from "./Video/Video";
import { useSelector } from "react-redux";
import { RootState } from "../redux-store";

export interface MediaControlsProps {
  micActive: boolean;
  cameraActive: boolean;
  cameraPermission: string;
  microphonePermission: string;
  localVideoRendererIsBusy: boolean;
  compressedMode: boolean;
  onMicChange(): void;
  onCameraChange(): void;
  onEndCallClick(): void;
}

export const MeetingComponent: React.FunctionComponent<MediaControlsProps> = (
  props: MediaControlsProps
) => {
  const examplePersona: IPersonaSharedProps = {
    imageUrl: auth.currentUser?.photoURL!,
    text: auth.currentUser?.displayName!,
    secondaryText: auth.currentUser?.email!,
  };

  const context = useContext(SocketContext);
  const mediaStreamError: string = useSelector(
    (state: RootState) => state.mediaStreamErrorReducer.mediaStreamError
  );

  const [camStatus, setCamStatus] = useState<string>("on");
  const [micStatus, setMicStatus] = useState<string>("on");

  const handleOnCamClick = () => {
    camStatus === "on" ? setCamStatus("off") : setCamStatus("on");
    context.toggleVideoSettings();
  };

  const handleOnMicClick = () => {
    micStatus === "on" ? setMicStatus("off") : setMicStatus("on");
    context.toggleAudioSettings();
  };

  return (
    <>
      <Stack>
        <Stack {...headerProps}>
          <Persona
            {...examplePersona}
            size={PersonaSize.size72}
            presence={PersonaPresence.busy}
            // styles={personaStyles}
          />
          <Persona
            {...examplePersona}
            size={PersonaSize.size72}
            presence={PersonaPresence.busy}
            // styles={personaStyles}
          />
          <Stack horizontal tokens={{ childrenGap: "18px" }}>
            {mediaStreamError ? (
              <MessageBar messageBarType={MessageBarType.severeWarning}>
                {mediaStreamError}
              </MessageBar>
            ) : (
              ""
            )}
            <Stack
              verticalAlign="center"
              style={{ width: "18px", cursor: "pointer" }}
              onClick={handleOnCamClick}
            >
              {camStatus === "on" ? (
                <CallVideoIcon size="smaller" />
              ) : (
                <CallVideoOffIcon size="smaller" />
              )}
            </Stack>
            <Stack
              verticalAlign="center"
              style={{ width: "18px", cursor: "pointer" }}
              onClick={handleOnMicClick}
            >
              {micStatus === "on" ? (
                <MicIcon size="smaller" />
              ) : (
                <MicOffIcon size="smaller" />
              )}
            </Stack>
            <PrimaryButton onClick={context.leaveCall} {...declineCallProps} />
          </Stack>
        </Stack>
        <Stack {...personaLayoutProps}>
          <Video />
        </Stack>
      </Stack>
    </>
  );
};

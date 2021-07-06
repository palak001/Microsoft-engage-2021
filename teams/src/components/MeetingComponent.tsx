import { PrimaryButton, Stack, Image, TextField } from "@fluentui/react";
import React, { useContext, useState } from "react";
import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import {
  headerProps,
  personaLayoutProps,
  personaStyles,
  declineCallProps,
  imageStyleProps,
  personaStyle,
} from "./Styles";
import personaSVG from "../assets/persona.svg";
import {
  MicIcon,
  MicOffIcon,
  CallVideoIcon,
  CallVideoOffIcon,
} from "@fluentui/react-icons-northstar";
import { auth } from "../config/firebase";
import { SocketContext } from "../SockectContext";
import Video from "./Video/Video";

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
    imageInitials: "AL",
    text: auth.currentUser?.displayName!,
    secondaryText: auth.currentUser?.email!,
    tertiaryText: "In a meeting",
  };

  const context = useContext(SocketContext);

  const [camStatus, setCamStatus] = useState<string>("on");
  const [micStatus, setMicStatus] = useState<string>("on");
  // chat
  const [chat, setChat] = useState<string>("");

  const handleOnCamClick = () => {
    camStatus === "on" ? setCamStatus("off") : setCamStatus("on");
    context.toggleVideoSettings();
  };

  const handleOnMicClick = () => {
    micStatus === "on" ? setMicStatus("off") : setMicStatus("on");
    context.toggleAudioSettings();
  };

  const handleSubmit = () => {
    console.log(chat);
    setChat("");
    context.sendChatMessage(chat);
  };

  const handleChange = (e: any) => {
    setChat(e.target.value);
  };

  return (
    <>
      <Stack>
        <Stack {...headerProps}>
          <Persona
            {...examplePersona}
            size={PersonaSize.size72}
            presence={PersonaPresence.busy}
            styles={personaStyles}
          />
          <Stack horizontal tokens={{ childrenGap: "18px" }}>
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
        <Stack horizontal>
          <Stack {...personaLayoutProps}>
            {/* <Image
            alt="Welcome to the Microsoft Teams"
            class
            <Video />
          </Stack>
          <Stack>
            {/* chat */}
            <TextField value={chat} onChange={handleChange} />
            <button onClick={handleSubmit}>Send</button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
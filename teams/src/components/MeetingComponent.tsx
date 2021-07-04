import { PrimaryButton, Stack, CommandButton, Image } from "@fluentui/react";
import React from "react";
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
  cmdStackProps,
  meetingActionProps,
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
    imageUrl: "https://miro.medium.com/max/948/0*9UgsryOBGjrws1_z.jpg",
    imageInitials: "AL",
    text: "Payal",
    secondaryText: "quepayal@gmail.com",
    tertiaryText: "In a meeting",
  };
  const imageProps = { src: personaSVG.toString() };
  const cameraActive =
    props.cameraPermission === "Denied" ? false : props.cameraActive;
  const cameraDisabled = props.cameraPermission === "Denied";
  const cameraOnClick =
    props.cameraPermission !== "Denied" ? props.onCameraChange : undefined;
  const micActive =
    props.microphonePermission === "Denied" ? false : props.micActive;
  const micDisabled = props.microphonePermission === "Denied";
  const micOnClick =
    props.microphonePermission !== "Denied" ? props.onMicChange : undefined;

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
          <Stack {...meetingActionProps}>
            <CommandButton onClick={cameraOnClick} disabled={cameraDisabled}>
              <Stack {...cmdStackProps}>
                <CallVideoIcon size="medium" />

                {cameraActive ? (
                  <CallVideoIcon size="medium" />
                ) : (
                  <CallVideoOffIcon size="medium" />
                )}
              </Stack>
            </CommandButton>
            <CommandButton onClick={micOnClick} disabled={micDisabled}>
              <Stack {...cmdStackProps}>
                {micActive ? (
                  <MicIcon size="medium" />
                ) : (
                  <MicOffIcon size="medium" />
                )}
              </Stack>
            </CommandButton>
            <PrimaryButton
              onClick={props.onEndCallClick}
              {...declineCallProps}
            />
          </Stack>
        </Stack>

        <Stack {...personaLayoutProps}>
          <Image
            alt="Welcome to the Microsoft Teams"
            className={personaStyle}
            styles={imageStyleProps}
            {...imageProps}
          />
        </Stack>
      </Stack>
    </>
  );
};

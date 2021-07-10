import {
  Icon,
  initializeIcons,
  MessageBar,
  MessageBarType,
  PanelType,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import React, { useContext, useState } from "react";
import { Panel } from "@fluentui/react/lib/Panel";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-store";
import { useBoolean } from "@fluentui/react-hooks";
import { ChatComponent } from "./ChatComponent";
import { setControlsAction } from "../redux-store/Video/ControlsReducer";

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
  initializeIcons();
  const examplePersona: IPersonaSharedProps = {
    imageUrl: auth.currentUser?.photoURL!,
    text: auth.currentUser?.displayName!,
    secondaryText: auth.currentUser?.email!,
    showInitialsUntilImageLoads: true,
  };

  const context = useContext(SocketContext);
  const dispatch = useDispatch();
  const mediaStreamError: string = useSelector(
    (state: RootState) => state.mediaStreamErrorReducer.mediaStreamError
  );

  const globalCamStatus: string = useSelector(
    (state: RootState) => state.controlsReducer.camera
  );
  const globalMicStatus: string = useSelector(
    (state: RootState) => state.controlsReducer.mic
  );

  const [camStatus, setCamStatus] = useState<string>(globalCamStatus);
  const [micStatus, setMicStatus] = useState<string>(globalMicStatus);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const handleOnCamClick = () => {
    camStatus === "on" ? setCamStatus("off") : setCamStatus("on");
    context.toggleVideoSettings();
    dispatch(setControlsAction({ mic: micStatus, camera: camStatus }));
  };

  const handleOnMicClick = () => {
    micStatus === "on" ? setMicStatus("off") : setMicStatus("on");
    context.toggleAudioSettings();
    dispatch(setControlsAction({ mic: micStatus, camera: camStatus }));
  };

  return (
    <Stack verticalFill>
      <Stack {...headerProps} horizontal horizontalAlign="space-between">
        <Persona
          {...examplePersona}
          size={PersonaSize.size72}
          presence={PersonaPresence.busy}
          // styles={personaStyles}
        />
        <Stack
          horizontal
          verticalAlign="center"
          tokens={{ childrenGap: "18px" }}
        >
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
          <Stack style={{ cursor: "pointer" }}>
            <Icon iconName="chat" onClick={openPanel}></Icon>
          </Stack>
          <PrimaryButton onClick={context.leaveCall} {...declineCallProps} />
        </Stack>
      </Stack>
      <Stack style={{ height: "90%" }}>
        <Stack
          style={{ height: "10%" }}
          tokens={{ padding: "10px 40px 10px 40px" }}
        >
          {mediaStreamError ? (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              {mediaStreamError}
            </MessageBar>
          ) : (
            ""
          )}
        </Stack>
        <Stack style={{ height: "90%" }} {...personaLayoutProps}>
          <Video />
        </Stack>
        <Stack>
          <Panel
            headerText="Chats"
            // this prop makes the panel non-modal
            isBlocking={false}
            isOpen={isOpen}
            onDismiss={dismissPanel}
            closeButtonAriaLabel="Close"
            type={PanelType.medium}
          >
            <ChatComponent options={"none"} />
          </Panel>
        </Stack>
      </Stack>
    </Stack>
  );
};

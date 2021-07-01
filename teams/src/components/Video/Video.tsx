import { Persona, PersonaSize, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { SocketContext } from "../../SockectContext";
import Controllers from "../Controllers/Controllers";
import { friendVideoStackProps, yourVideoStackProps } from "./Video.styles";

const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  const selectedUser: FirebaseUser = useSelector(
    (state: RootState) => state.selectedUserReducer.selectedUserDetails
  );

  return (
    <Stack verticalFill>
      <Stack {...yourVideoStackProps}>
        <video
          width="100%"
          height="100%"
          playsInline
          ref={context.yourVideo}
          style={{ objectFit: "cover" }}
          muted
          autoPlay
        />
      </Stack>
      <Stack {...friendVideoStackProps}>
        {context.callStarted && !context.callAccepted ? (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Persona
              imageUrl={selectedUser.photoURL}
              size={PersonaSize.size56}
              imageAlt="Palak, status is online"
            />
          </Stack>
        ) : (
          <video
            width="100%"
            height="100%"
            playsInline
            ref={context.friendVideo}
            style={{ objectFit: "cover" }}
            poster=""
            autoPlay
          />
        )}
      </Stack>
      <Stack>
        <Controllers />
      </Stack>
    </Stack>
  );
};

export default Video;

import { Persona, PersonaSize, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { SocketContext } from "../../SockectContext";
import { friendVideoStackProps, yourVideoStackProps } from "./Video.styles";

const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  // const selectedUser: FirebaseUser = useSelector(
  //   (state: RootState) => state.selectedUserReducer.selectedUserDetails
  // );

  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
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
              imageUrl={enteredUserDetails.photoURL}
              size={PersonaSize.size72}
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
            autoPlay
          />
        )}
      </Stack>
    </Stack>
  );
};

export default Video;

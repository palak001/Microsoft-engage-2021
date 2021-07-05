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
          style={{ objectFit: "cover", border: "1px solid green" }}
          // poster="https://images.unsplash.com/photo-1625153696373-74a0df2c71f0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80"
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
            // poster="https://images.unsplash.com/photo-1625153696373-74a0df2c71f0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80"
            autoPlay
          />
        )}
      </Stack>
      {/* <Stack>
        <Controllers />
      </Stack> */}
    </Stack>
  );
};

export default Video;

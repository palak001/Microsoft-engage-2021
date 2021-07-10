import { Persona, PersonaSize, Stack, Image } from "@fluentui/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { SocketContext } from "../../SockectContext";
import { friendVideoStackProps, yourVideoStackProps } from "./Video.styles";
import personaSVG from "../../assets/persona.svg";
import { imageStyleProps, personaStyle } from "../Styles";

const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  // const selectedUser: FirebaseUser = useSelector(
  //   (state: RootState) => state.selectedUserReducer.selectedUserDetails
  // );

  const enteredUserDetails: FirebaseUser = useSelector(
    (state: RootState) => state.enteredUserDetailsReducer.enteredUserDetails
  );
  const imageProps = { src: personaSVG.toString() };

  return (
    <Stack style={{ width: "100%", height: "100%" }}>
      <Stack {...yourVideoStackProps}>
        <video
          width="100%"
          height="100%"
          playsInline
          ref={context.yourVideo}
          // style={{ objectFit: "cover" }}
          poster={imageProps.src}
          muted
          autoPlay
        />
      </Stack>

      <Stack {...friendVideoStackProps}>
        <video
          width="100%"
          height="100%"
          playsInline
          ref={context.friendVideo}
          // style={{ objectFit: "cover" }}
          poster={imageProps.src}
          autoPlay
        />
      </Stack>
    </Stack>
  );
};

export default Video;

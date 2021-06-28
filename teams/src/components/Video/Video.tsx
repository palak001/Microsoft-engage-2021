import { Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";
import { friendVideoStackProps, yourVideoStackProps } from "./Video.styles";

const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);

  return (
    <Stack verticalFill>
      <Stack {...yourVideoStackProps}>
        <video
          width="100%"
          height="100%"
          playsInline
          ref={context.yourVideo}
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
          autoPlay
        />
      </Stack>
    </Stack>
  );
};

export default Video;

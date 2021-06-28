import { Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";
import Controllers from "../Controllers/Controllers";
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
          style={{ objectFit: "cover" }}
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
          style={{ objectFit: "cover" }}
          autoPlay
        />
      </Stack>
      <Stack>
        <Controllers />
      </Stack>
    </Stack>
  );
};

export default Video;

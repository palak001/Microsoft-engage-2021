import { Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";
import { StackProps } from "./Video.styles";

const Video: React.FunctionComponent = () => {
  const context = useContext(SocketContext);
  return (
    <Stack horizontal>
      <Stack>
        <button
          onClick={async () => {
            // set user stream
            // navigator.mediaDevices
            //   .getUserMedia({ video: true, audio: true })
            //   .then((currentStream) => {
            //     context.setStream(currentStream);
            //     if (context.yourVideo.current)
            //       context.yourVideo.current.srcObject = currentStream;
            //   });
            await context.setStreamFunction();
            context.answerCall();
          }}
        >
          AcceptCall
        </button>
      </Stack>

      <Stack {...StackProps}>
        your video
        <video playsInline ref={context.yourVideo} muted autoPlay />
      </Stack>
      <Stack style={{ backgroundColor: "pink" }} {...StackProps}>
        your friend video
        {console.log(context.friendVideo)}
        <video playsInline ref={context.friendVideo} muted autoPlay />
      </Stack>
    </Stack>
  );
};

export default Video;

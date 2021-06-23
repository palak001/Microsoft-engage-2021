import { IStackTokens, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { SocketContext } from "../../SockectContext";
import { StackProps } from "./Video.styles";
import { DefaultButton } from "@fluentui/react/lib/Button";

const stackTokens: IStackTokens = { childrenGap: 40 };

const Video: React.FunctionComponent = () => {
  // const { disabled, checked } = props;

  const context = useContext(SocketContext);
  return (
    <Stack verticalFill padding="40px">
      <Stack
        horizontal
        horizontalAlign="center"
        style={{ width: "90%", height: "90%" }}
      >
        <Stack {...StackProps}>
          <Stack padding="10px">
            <h4>Your Video</h4>
          </Stack>
          <Stack>
            <video
              width="90%"
              height="90%"
              playsInline
              ref={context.yourVideo}
              muted
              autoPlay
            />
          </Stack>
        </Stack>
        <Stack {...StackProps}>
          <Stack padding="10px">
            <h4>Friend's Video</h4>
          </Stack>
          <Stack>
            <video
              width="90%"
              height="90%"
              playsInline
              ref={context.friendVideo}
              autoPlay
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack
        style={{
          width: "50%",
          height: "50%",
        }}
        horizontalAlign="center"
      >
        {context.callDetails?.from ? (
          <Stack horizontalAlign="center">
            <Stack padding="10px">
              {context.callDetails?.from} is calling you
            </Stack>

            <Stack horizontal tokens={stackTokens}>
              <DefaultButton
                text="AcceptCall"
                onClick={() => {
                  context.answerCall();
                  // context.setCalleeStreamFunction();
                }}
                allowDisabledFocus
              />
            </Stack>
          </Stack>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};

export default Video;

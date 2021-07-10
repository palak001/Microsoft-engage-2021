import { PrimaryButton, Stack, Text } from "@fluentui/react";
import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router";
import { auth } from "../../config/firebase";
import { SocketContext } from "../../SockectContext";
import { signUpStackChildrenProps, signUpStackProps } from "./SignUp.styles";

export const ActiveSession: React.FunctionComponent = () => {
  const history = useHistory();
  const context = useContext(SocketContext);
  const handleSignOut = () => {
    auth.signOut().then(() => {
      context.socket.current.emit("signOut");
      history.push("/signup");
    });
  };
  return (
    <Stack {...signUpStackProps}>
      <Stack {...signUpStackChildrenProps} style={{ maxWidth: "60%" }}>
        <Text
          style={{
            fontSize: "35px",
            fontStyle: "normal",
            fontWeight: "normal",
          }}
        >
          You already have an active session.
        </Text>
        <br></br>
        <Text
          style={{
            fontSize: "20px",
          }}
        >
          Why seeing this message?
        </Text>
        <br></br>
        <ul>
          <li>
            <Text>
              You might be trying to access the Application in multiple tabs in
              the same browser. Please make sure there's only one instance of
              application opened per browser.
            </Text>
          </li>
          <li>
            <Text>
              You might be trying to access the Application in multiple
              browsers/devices using same google account. Please make sure to
              use two different accounts to access the application. As per the
              intended functionality you cannot chat or video call using same
              accounts at both end.
            </Text>
          </li>

          <li>
            <Text>
              If you want to access the application using multiple google
              accounts then please make sure to either use two different
              browsers or different devices to run the application.
            </Text>
          </li>
        </ul>
        <Text
          style={{
            fontSize: "20px",
          }}
        >
          Seems like a mistake?
        </Text>
        <br></br>
        <ul>
          <li>
            <Text>Try refreshing the application some times.</Text>
          </li>
        </ul>
        {/* <h5>Already have an account? Sign in here</h5> */}

        <PrimaryButton onClick={handleSignOut}>
          Sign Out all sessions from this browser
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

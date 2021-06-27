import { Icon, initializeIcons, Stack } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { signUpStackChildrenProps, signUpStackProps } from "./SignUp.styles";
import firebase from "firebase";
import { SignInWithSocialMedia } from "../../services/auth";
import { Providers } from "../../config/firebase";
import { Text } from "@fluentui/react/lib/Text";

export const SignUp: React.FunctionComponent = () => {
  const [error, setError] = useState<string>("");
  const history = useHistory();
  initializeIcons();

  const signInWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
    if (error !== "") setError("");
    SignInWithSocialMedia(provider)
      .then((result) => {
        history.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Stack {...signUpStackProps}>
      <Stack {...signUpStackChildrenProps}>
        <Stack horizontalAlign="center">
          <Icon
            iconName={"TeamsLogo16"}
            style={{ fontSize: "40px", color: "#6264A7" }}
            // {...IconProps}
          />
          <Text variant={"xxLarge"}>Sign in to Microsoft Teams</Text>
        </Stack>
        <Stack horizontalAlign="center">
          <PrimaryButton
            style={{ backgroundColor: "#6264A7" }}
            onClick={() => signInWithSocialMedia(Providers.google)}
          >
            <Text style={{ color: "white" }}>Sign in using Google</Text>
          </PrimaryButton>
          {/* <Text>Already have an account? Sign in here</Text> */}
        </Stack>
      </Stack>
    </Stack>
  );
};

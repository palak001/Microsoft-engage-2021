import { Stack } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { signUpStackChildrenProps, signUpStackProps } from "./SignUp.styles";
import firebase from "firebase";
import { SignInWithSocialMedia } from "../../services/auth";
import { Providers } from "../../config/firebase";

export const SignUp: React.FunctionComponent = () => {
  // local states
  // const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const history = useHistory();

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
        <PrimaryButton onClick={() => signInWithSocialMedia(Providers.google)}>
          Sign up using Google
        </PrimaryButton>
        <br></br>
        <h5>Already have an account? Sign in here</h5>
      </Stack>
    </Stack>
  );
};

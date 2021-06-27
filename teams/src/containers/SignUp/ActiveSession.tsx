import { PrimaryButton, Stack } from "@fluentui/react";
import React from "react";
import { signUpStackChildrenProps, signUpStackProps } from "./SignUp.styles";

export const ActiveSession: React.FunctionComponent = () => {
  return (
    <Stack {...signUpStackProps}>
      <Stack {...signUpStackChildrenProps}>
        <PrimaryButton>You already have an active session.</PrimaryButton>
        <br></br>
        {/* <h5>Already have an account? Sign in here</h5> */}
      </Stack>
    </Stack>
  );
};

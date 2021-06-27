import { Stack } from "@fluentui/react";
import React from "react";
import { Text } from "@fluentui/react/lib/Text";

export const NormalHeader: React.FunctionComponent = () => {
  return (
    <Stack
      verticalAlign="center"
      style={{
        height: "100%",
        width: "100%",
        padding: "18px",
        fontSize: "15px",
        color: "grey",
        backgroundColor: "white",
        borderBottom: "0.2px #D2D7DF solid",
      }}
    >
      <Text>To: Enter email</Text>
    </Stack>
  );
};

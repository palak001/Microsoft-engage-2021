import { Stack } from "@fluentui/react";
import React from "react";

export const NormalHeader: React.FunctionComponent = () => {
  return (
    <Stack
      verticalAlign="center"
      style={{
        height: "100%",
        width: "100%",
        paddingLeft: "30px",
        fontSize: "13px",
        color: "grey",
        backgroundColor: "white",
        borderBottom: "0.2px #D2D7DF solid",
      }}
    >
      To: Enter email
    </Stack>
  );
};

import { IStackProps } from "@fluentui/react";

export const signUpStackChildrenProps: IStackProps = {
  tokens: {
    padding: "10px",
  },
  // verticalAlign: "center",
  verticalAlign: "space-evenly",
  styles: {
    root: {
      position: "absolute",
      left: "39%",
      right: "39%",
      top: "12%",
      bottom: "56%",
      backgroundColor: "#FFFFFF",
      border: "0.5px solid #E5E5E5",
      boxSizing: "border-box",
      boxShadow:
        "0px 1.6px 3.6px rgba(0, 0, 0, 0.132), 0px 0.3px 0.9px rgba(0, 0, 0, 0.108)",
      borderRadius: "4px",
    },
  },
};

export const signUpStackProps: IStackProps = {
  tokens: {},
  verticalAlign: "center",
  horizontalAlign: "center",
  styles: {
    root: {
      height: "100vh",
      fontFamily: "Segoe UI Web (West European)",
    },
  },
};

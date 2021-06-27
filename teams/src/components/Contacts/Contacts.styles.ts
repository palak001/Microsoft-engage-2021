import { IStackProps } from "@fluentui/react";

export const ContactStackProp: IStackProps = {
  verticalAlign: "center",
  styles: {
    root: {
      padding: "5px",
      //   border: "1px grey solid",
      height: "50px",
      cursor: "pointer",
      selectors: {
        ":hover": { backgroundColor: "#EAECEA" },
      },
    },
  },
};

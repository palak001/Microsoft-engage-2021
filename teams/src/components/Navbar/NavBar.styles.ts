import { IPersonaSharedProps, IStackProps } from "@fluentui/react";

export const NavBarStackProps: IStackProps = {
  tokens: {
    padding: "30px",
  },
  verticalAlign: "center",
  horizontalAlign: "space-between",
  styles: {
    root: {
      backgroundColor: "black",
      height: "100%",
      color: "white",
      fontSize: "25px",
      fontStyle: "bold",
    },
  },
};

export const PersonaProps: IPersonaSharedProps = {
  imageInitials: "P",
  style: {
    fontSize: "40px",
  },
};

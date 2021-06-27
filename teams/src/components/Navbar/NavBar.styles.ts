import {
  IPersonaSharedProps,
  ISearchBoxProps,
  IStackProps,
} from "@fluentui/react";

export const NavBarStackProps: IStackProps = {
  tokens: {
    padding: "30px",
  },
  verticalAlign: "center",
  horizontalAlign: "space-between",
  styles: {
    root: {
      backgroundColor: "black",
      height: "50px",
      color: "white",
      fontSize: "25px",
      fontStyle: "bold",
    },
  },
};

export const SearchProps: ISearchBoxProps = {
  placeholder: "Search",
  styles: {
    root: {
      width: "100%",
      backgroundColor: "#EAECEA",
      color: "#646464",
    },
  },
};

export const PersonaProps: IPersonaSharedProps = {
  imageInitials: "S",
};

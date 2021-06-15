import {
  IIconProps,
  IPersonaSharedProps,
  ISearchBoxProps,
  IStackProps,
} from "@fluentui/react";

export const NavBarStackProps: IStackProps = {
  tokens: {
    // padding: "25px",
  },
  verticalAlign: "center",
  horizontalAlign: "space-between",
  styles: {
    root: {
      background: "#464775",
      height: "50px",
      color: "white",
      fontSize: "16px",
      fontStyle: "bold",
    },
  },
};

export const IconProps: IIconProps = {
  styles: {
    root: {
      fontSize: "20px",
      width: "25px",
    },
  },
};

export const SearchProps: ISearchBoxProps = {
  placeholder: "Search",

  styles: {
    root: {
      width: "100%",
      backgroundColor: "#D2D3DB",
    },
  },
};

export const PersonaProps: IPersonaSharedProps = {
  imageInitials: "P",
};

import { IIconProps, IStackProps } from "@fluentui/react";

export const MainBodyStackProps: IStackProps = {
  tokens: {},
  verticalFill: true,
  horizontal: true,
  horizontalAlign: "space-between",
  styles: {
    root: {
      // backgroundColor: "#ECEDE8",
    },
  },
};

export const IconProps: IIconProps = {
  styles: {
    root: {
      fontSize: "20px",
      padding: "14px 13px 3px 0px",
      color: "white",
      cursor: "pointer",
    },
  },
};

export const SearchIconProps: IIconProps = {
  iconName: "",
  styles: {
    root: {
      fontSize: "24px",
      width: "24px",
      padding: "18px",
      color: "grey",
    },
  },
};

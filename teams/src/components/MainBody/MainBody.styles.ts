import { IIconProps, IStackProps } from "@fluentui/react";

export const MainBodyStackProps: IStackProps = {
  verticalFill: true,
  horizontal: true,
  horizontalAlign: "space-between",
  styles: {
    root: {
      backgroundColor: "#ECEDE8",
    },
  },
};

export const IconProps: IIconProps = {
  styles: {
    root: {
      fontSize: "20px",
      width: "24px",
      padding: "14px 13px 3px 14px",
      color: "grey",
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

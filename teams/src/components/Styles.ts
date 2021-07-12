import {
  getFocusStyle,
  getTheme,
  IButtonProps,
  IIconProps,
  IImageStyles,
  IScrollablePaneProps,
  IStackItemProps,
  IStackProps,
  ITextFieldProps,
  ITextProps,
  ITheme,
  mergeStyles,
  mergeStyleSets,
  ScrollbarVisibility,
} from "@fluentui/react";

// Contains all major styles

export const mainStack: IStackProps = {
  styles: {
    root: {
      height: "100%",
      width: "100%",
    },
  },
};

export const headerProps: IStackProps = {
  verticalAlign: "center",
  tokens: {
    padding: "10px 40px 10px 40px",
  },
  styles: {
    root: {
      width: "100%",
      height: "10%",
    },
  },
};

export const sandbox: IStackProps = {
  tokens: {
    padding: "15% 0 0 0 ",
  },
  styles: {
    root: {
      width: "50%",
      height: "100%",
    },
  },
};

export const content: IStackProps = {
  tokens: {
    childrenGap: "1%",
    padding: "0, 0, 0, 8%",
  },
  horizontalAlign: "start",
};

export const actionProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  verticalAlign: "center",
  tokens: {
    padding: "30px 0px 0px 0px",
  },
};

export const LayoutProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  verticalAlign: "center",
  tokens: {
    padding: "5px 10px 0 10px",
  },
  styles: {
    root: {
      height: "90%",
    },
  },
};

export const personaLayoutProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "center",
  verticalAlign: "center",
  // tokens: { padding: "5% 0 0 0" },
  styles: {
    root: {
      width: "100%",
      height: "100%",
    },
  },
};

const videoCallIcon: IIconProps = { iconName: "PresenceChickletVideo" };

export const videoCallActionProps: Partial<IButtonProps> = {
  iconProps: videoCallIcon,
  text: "Start a Meeting",
  allowDisabledFocus: true,
  styles: {
    root: {
      height: "40px",
      width: "200px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "24px",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

const keyboardIcon: IIconProps = { iconName: "KeyboardClassic" };

export const groupCallActionProps: Partial<ITextFieldProps> = {
  iconProps: keyboardIcon,
  required: true,
  placeholder: "Enter a code or link",
  styles: {
    root: {
      width: "300px",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

const emailIcon: IIconProps = { iconName: "Mail" };

export const emailActionProps: Partial<ITextFieldProps> = {
  iconProps: emailIcon,
  placeholder: "Enter the email of the person to connect",
  autoComplete: "false",
  styles: {
    root: {
      width: "100%",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

export const meetingNameActionProps: Partial<ITextFieldProps> = {
  placeholder: "Enter the Meeting Name",
  autoComplete: "false",
  styles: {
    root: {
      width: "100%",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

export const headingProps: ITextProps = {
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "50px",
      lineHeight: "60px",
      color: "#171717",
      width: "100%",
    },
  },
};

export const descProps: ITextProps = {
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      lineHeight: "24px",
      color: "#5F6368",
    },
  },
};

export const imageStyleProps: IImageStyles = {
  image: {
    height: "100%",
    width: "100%",
  },
  root: {},
};

export const imgStyle = mergeStyles({
  width: "30rem",
  height: "27.25rem",
  selectors: {
    "@media (max-width: 67.1875rem)": {
      display: "none",
    },
  },
});

export const personaStyle = mergeStyles({
  width: "50rem",
  height: "27.25rem",
});

const sendIcon: IIconProps = { iconName: "Send" };

export const nextActionProps: Partial<IButtonProps> = {
  iconProps: sendIcon,
  text: "Next",
  allowDisabledFocus: true,
  styles: {
    root: {
      height: "40px",
      width: "120px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "24px",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

export const cancelActionProps: Partial<IButtonProps> = {
  text: "Cancel",
  allowDisabledFocus: true,
  styles: {
    root: {
      height: "40px",
      width: "120px",
      fontFamily: "Segoe UI",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "24px",
    },
    icon: {
      fontSize: "20px",
    },
  },
};

export const modalProps: ITextProps = {
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "20px",
      lineHeight: "25px",
      color: "#171717",
    },
  },
};

export const modalActionProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  // verticalAlign: "center",
  tokens: {
    padding: "0px 0px 10px 0px",
    childrenGap: "120px",
  },
};

export const modalStackProps: IStackProps = {
  // horizontalAlign: "center",
  // verticalAlign: "center",
  tokens: {
    padding: "20px 0px 0px 0px",
    childrenGap: "30px",
  },
};

export const modalStackChildProps: IStackProps = {
  tokens: {
    childrenGap: "10px",
  },
};

export const container: IStackProps = {
  tokens: {
    padding: "25px",
  },
};

export const meetingActionProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  verticalAlign: "center",
  styles: {
    root: {
      width: "13rem",
    },
  },
};

export const cmdStackProps: IStackProps = {
  styles: {
    root: {
      width: "1rem",
      fill: "#605e5c",
    },
  },
};

const declineCallIcon: IIconProps = { iconName: "DeclineCall" };

export const declineCallProps: Partial<IButtonProps> = {
  iconProps: declineCallIcon,
  text: "Leave",
  allowDisabledFocus: true,
  styles: {
    root: {
      width: "120px",
      background: "#d74654",
      color: "#ffffff",
      border: "none",
    },
    rootFocused: {
      background: "#d74654",
      border: "none",
    },
    rootPressed: {
      background: "#d74654",
      border: "none",
    },
    rootHovered: {
      background: "#d74654",
      border: "none",
    },
    icon: {
      fontSize: "20px",
      color: "#ffffff",
    },
  },
};

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
export const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    maxHeight: 500,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      selectors: {
        "&:hover": { background: palette.neutralLight },
      },
    },
  ],
  itemContent: {
    marginLeft: 10,
    overflow: "hidden",
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  ],
});

export const meetingListProps: IStackProps = {
  tokens: {
    childrenGap: "20px",
  },
  styles: {
    root: {
      width: "100%",
      maxHeight: "300px",
      overflow: "scroll",
      overflowX: "hidden",
    },
  },
};

export const vertical: IStackProps = {
  styles: {
    root: {
      width: "0px",
      height: "40vh",
      borderRight: "00.05px solid #bcbcbc",
    },
  },
};

export const newMeetingProps: Partial<IButtonProps> = {
  iconProps: {
    iconName: "PeopleAdd",
  },
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "20px",
      lineHeight: "20px",
      color: "#0064BF",
      height: "40px",
      width: "100%",
    },
    rootPressed: {
      color: "#0064BF",
    },
    rootHovered: {
      color: "#0064BF",
    },
    icon: {
      fontSize: "20px",
    },
    iconHovered: {
      color: "#0064BF",
    },
  },
};

// chat component
export const chatHeadingProps: IStackProps = {
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "500",
      fontSize: "30px",
      lineHeight: "40px",
      color: "#605e5c",
    },
  },
};

export const videoCallProps: IStackProps = {
  verticalAlign: "center",
  styles: {
    root: {
      width: "20px",
      fill: "#0078d4",
    },
  },
};

export const textActionProps: Partial<ITextFieldProps> = {
  placeholder: "Type a new message",
  styles: {
    root: {
      width: "1700px",
      selectors: {
        "@media only screen and (max-width: 1367px)": {
          width: "1200px",
        },
        "@media only screen and (max-width: 1024px)": {
          width: "900px",
        },
        "@media only screen and (max-width: 640px)": {
          width: "485px",
        },
        "@media only screen and (max-width: 480px)": {
          width: "341px",
        },
        "@media only screen and (max-width: 320px)": {
          width: "300px",
        },
      },
    },
    field: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "20px",
      color: "#171717",
    },
  },
};

export const textStackProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  verticalAlign: "center",
  tokens: {
    childrenGap: "1%",
    padding: "20px 50px 20px 50px",
  },
};

export const sendTextProps: Partial<IButtonProps> = {
  iconProps: sendIcon,
  allowDisabledFocus: true,
  styles: {
    icon: {
      fontSize: "24px",
      fill: "#0078d4",
    },
  },
};

export const chatLayoutProps: IStackProps = {
  tokens: {
    // childrenGap: "20px",
  },
  styles: {
    root: {
      height: "100vh",
    },
  },
};

export const chatContainerProps: IStackItemProps = {
  styles: {
    root: {
      position: "relative",
    },
  },
};

export const scrollablePaneProps: IScrollablePaneProps = {
  scrollbarVisibility: ScrollbarVisibility.auto,
  styles: {
    root: {
      position: "absolute",
    },
  },
};

export const chatScreenProps: IStackProps = {
  tokens: {
    padding: "10px 40px 10px 40px",
    childrenGap: "20px",
  },
  styles: {
    root: {
      // height: "80vh",
    },
  },
};

export const neutralLight: IStackProps = {
  tokens: {
    padding: "10px",
  },
  styles: {
    root: {
      maxWidth: "1000px",
      background: "#f3f2f1",
      borderRadius: "4px",
      fontFamily: "Segoe UI",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      lineHeight: "22px",
    },
  },
};

export const duskLight: IStackProps = {
  tokens: {
    padding: "10px",
  },
  styles: {
    root: {
      maxWidth: "1000px",
      background: "#c7e0f4",
      borderRadius: "4px",
      fontFamily: "Segoe UI",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      lineHeight: "22px",
    },
  },
};

export const callWidget: IStackProps = {
  verticalAlign: "center",
  horizontalAlign: "center",
  tokens: {
    // padding: "70vh 0vh 0vh 0vh",
  },
  styles: {
    root: {
      background: "#FAFAFA",
      color: "#1C1C1C",
      // width: "250px",
      // height: "300px",
      position: "absolute",
      top: "70%",
      width: "30%",
      left: "70%",
      height: "30%",
    },
  },
};

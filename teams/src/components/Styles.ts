import {
  getFocusStyle,
  getTheme,
  IButtonProps,
  IIconProps,
  IImageStyles,
  IPersonaStyles,
  IStackProps,
  ITextFieldProps,
  ITextProps,
  ITheme,
  mergeStyles,
  mergeStyleSets,
} from "@fluentui/react";

export const personaStyles: Partial<IPersonaStyles> = {
  root: { margin: "0 0 10px 0" },
};

export const headerProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "space-between",
  verticalAlign: "center",
  tokens: {
    padding: "10px 50px 10px 50px",
  },
};

export const sandbox: IStackProps = {
  tokens: {
    childrenGap: "20px",
  },
  styles: {
    root: {
      maxWidth: "600px",
    },
  },
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
    padding: "5% 10% 0 10%",
  },
};

export const personaLayoutProps: IStackProps = {
  horizontal: true,
  horizontalAlign: "center",
  verticalAlign: "center",
  tokens: { padding: "5% 0 0 0" },
};

const videoCallIcon: IIconProps = { iconName: "PresenceChickletVideo" };

export const videoCallActionProps: Partial<IButtonProps> = {
  iconProps: videoCallIcon,
  text: "New Meeting",
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
  placeholder: "Enter the Email Address",
  autoComplete: "false",
  styles: {
    root: {
      width: "400px",
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
      width: "400px",
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
      // fontFamily: "Segoe UI",
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
  verticalAlign: "center",
  tokens: {
    padding: "0px 0px 10px 0px",
    childrenGap: "150px",
  },
};

export const modalStackProps: IStackProps = {
  horizontalAlign: "center",
  verticalAlign: "center",
  tokens: {
    padding: "30px 0px 0px 0px",
    childrenGap: "50px",
  },
};

export const modalStackChildProps: IStackProps = {
  tokens: {
    childrenGap: "10px",
  },
};

export const container: IStackProps = {
  horizontalAlign: "center",
  verticalAlign: "center",
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
      width: "700px",
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
    iconName: "CircleAddition",
  },
  styles: {
    root: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "20px",
      lineHeight: "20px",
      color: "#0064BF",
      height: "40px",
      width: "300px",
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

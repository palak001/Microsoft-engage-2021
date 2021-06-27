import { Text } from "@fluentui/react/lib/Text";
import {
  Icon,
  IIconProps,
  initializeIcons,
  IStackProps,
  mergeStyles,
  Stack,
} from "@fluentui/react";

const SideBarStackProps: IStackProps = {
  horizontalAlign: "center",
  verticalAlign: "center",
  styles: {
    root: {
      // border: "1px solid pink",
      height: "70px",
      width: "100%",
      padding: "10px",
      selectors: {
        ":hover": { backgroundColor: "#EAECEA", fontSize: "100px" },
      },
    },
  },
};

const IconProps: IIconProps = {
  styles: {
    root: {
      fontSize: "20px",
      color: "grey",
    },
  },
};

export const SideBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack
      horizontalAlign="center"
      verticalFill
      style={{
        color: "grey",
        borderRight: "solid 0.2px #646464",
        cursor: "pointer",
        width: "100%",
      }}
      // {...SideBarStackProps}
    >
      <Stack verticalAlign="start">
        <Stack horizontalAlign="center" {...SideBarStackProps}>
          <Icon iconName={"SkypeMessage"} {...IconProps} />
          <Text>Chat</Text>
        </Stack>
        <Stack horizontalAlign="center" {...SideBarStackProps}>
          <Icon iconName={"TeamsLogo16"} {...IconProps} />
          <Text>Teams</Text>
        </Stack>
      </Stack>
      <Stack></Stack>
    </Stack>
  );
};

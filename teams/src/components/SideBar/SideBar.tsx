import { Icon, initializeIcons, Stack } from "@fluentui/react";
import { IconProps } from "../MainBody/MainBody.styles";

export const SideBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack
      horizontalAlign="center"
      style={{
        fontSize: "10px",
        color: "grey",
        padding: "10px",
        width: "15%",
        // boxShadow:

        //   "0 3.2px 7.2px rgba(0, 0, 0,  0.132), 0px 0.6px 1.8px rgba(0, 0, 0, 0.108)",
      }}
    >
      <Icon iconName={"Phone"} {...IconProps} />
      Phone
      <Icon iconName={"Chat"} {...IconProps} />
      Chat
      <Icon iconName={"Group"} {...IconProps} />
      Teams
    </Stack>
  );
};

import React from "react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Icon } from "@fluentui/react/lib/Icon";
import {
  Persona,
  PersonaPresence,
  PersonaSize,
  SearchBox,
  Stack,
} from "@fluentui/react";
import {
  IconProps,
  NavBarStackProps,
  PersonaProps,
  SearchProps,
} from "./NavBar.styles";

export const NavBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack horizontal {...NavBarStackProps}>
      <Stack
        horizontal
        verticalAlign="center"
        style={{ width: "23%" }}
        // tokens={{ childrenGap: "10px" }}
      >
        <Stack style={{ width: "15%", padding: "12px" }}>
          <Icon iconName={"WaffleOffice365"} {...IconProps} />
        </Stack>
        <Stack style={{ width: "85%" }}>Microsoft Teams </Stack>
      </Stack>

      <Stack style={{ width: "59%" }}>
        <SearchBox
          {...SearchProps}
          onSearch={(newValue) => console.log("value is " + newValue)}
        />
      </Stack>

      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="end"
        tokens={{ childrenGap: "10px" }}
        style={{ width: "18%" }}
      >
        <Icon iconName={"more"} {...IconProps} />
        <Persona
          {...PersonaProps}
          size={PersonaSize.size32}
          presence={PersonaPresence.online}
          imageAlt="Palak, status is online"
        />
      </Stack>
    </Stack>
  );
};

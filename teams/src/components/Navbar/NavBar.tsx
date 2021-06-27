import React from "react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Text } from "@fluentui/react/lib/Text";
import {
  Persona,
  PersonaPresence,
  PersonaSize,
  SearchBox,
  Stack,
} from "@fluentui/react";
import { NavBarStackProps, PersonaProps, SearchProps } from "./NavBar.styles";

export const NavBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack horizontal {...NavBarStackProps}>
      <Stack horizontal verticalAlign="center" style={{ width: "23%" }}>
        <Stack style={{ width: "85%" }}>
          {" "}
          <Text style={{ color: "white", fontSize: "20px" }}>
            Microsoft Teams{" "}
          </Text>
        </Stack>
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
        style={{ width: "18%" }}
      >
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

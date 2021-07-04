import React from "react";
import { initializeIcons } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import {
  Persona,
  PersonaInitialsColor,
  PersonaSize,
  Stack,
} from "@fluentui/react";
import { NavBarStackProps, PersonaProps } from "./NavBar.styles";
import { ProfileOptions } from "../ProfileOptions/ProfileOptions";
import { auth } from "../../config/firebase";

export const NavBar: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <Stack horizontal {...NavBarStackProps}>
      <Stack horizontal verticalAlign="center" style={{ width: "23%" }}>
        <Stack>
          <Persona
            {...PersonaProps}
            size={PersonaSize.size48}
            initialsColor={PersonaInitialsColor.teal}
            imageUrl={auth.currentUser?.photoURL!}
            imageAlt="Palak, status is online"
          />
        </Stack>
        <Stack>
          {/* <Text color={"white"}>{auth.currentUser?.displayName}</Text> */}
          <Text variant={"xxLarge"} style={{ color: "white" }}>
            {" "}
            {auth.currentUser?.displayName}{" "}
          </Text>
          <Text style={{ color: "white" }}>{auth.currentUser?.email}</Text>
        </Stack>
      </Stack>

      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="end"
        style={{ width: "18%" }}
      >
        <ProfileOptions />
      </Stack>
    </Stack>
  );
};

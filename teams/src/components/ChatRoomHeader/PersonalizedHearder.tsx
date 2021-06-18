import { Icon, Persona, PersonaSize, Stack } from "@fluentui/react";
import React from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";

export const PersonalizedHeader: React.FunctionComponent = () => {
  const selectedUser: FirebaseUser = useSelector(
    (state: RootState) => state.selectedUserReducer.selectedUserDetails
  );

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      style={{
        height: "6.75%",
        width: "100%",
        paddingLeft: "30px",
        fontSize: "20px",
        borderBottom: "0.2px #D2D7DF solid",
      }}
    >
      <Stack horizontal verticalAlign="center">
        <Persona
          imageUrl={selectedUser.photoURL}
          size={PersonaSize.size32}
          // presence={PersonaPresence.online}
          imageAlt="Palak, status is online"
        />
        {selectedUser.displayName}
      </Stack>
      <Stack
        verticalAlign="center"
        onClick={() => {
          //   callPeer(selectedUser.uid);
        }}
      >
        <Icon
          iconName={"Video"}
          style={{
            marginRight: "15px",
            padding: "7px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "0.5px solid grey",
            color: "grey",
            cursor: "pointer",
          }}
        />
      </Stack>
    </Stack>
  );
};

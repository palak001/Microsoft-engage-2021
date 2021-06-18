import { Icon, Persona, PersonaSize, Stack } from "@fluentui/react";
import React from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";

export const ChatRoomHeader: React.FunctionComponent = () => {
  const selectedUser: FirebaseUser = useSelector(
    (state: RootState) => state.selectedUserReducer.selectedUserDetails
  );
  const dummyObj: FirebaseUser = {
    photoURL: "",
    displayName: "",
    uid: "",
    email: "",
  };

  if (JSON.stringify(dummyObj) === JSON.stringify(selectedUser))
    return (
      <Stack
        verticalAlign="center"
        style={{
          height: "6.75%",
          width: "100%",
          paddingLeft: "30px",
          fontSize: "13px",
          color: "grey",
          backgroundColor: "white",
          borderBottom: "0.2px #D2D7DF solid",
        }}
      >
        To: Enter email
      </Stack>
    );
  else {
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
            // callPeer(selectedUser.socketID);
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
  }
};

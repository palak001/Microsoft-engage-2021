import { Icon, Persona, PersonaSize, Stack } from "@fluentui/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { db } from "../../config/firebase";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { SocketContext } from "../../SockectContext";

export const PersonalizedHeader: React.FunctionComponent = () => {
  const context = useContext(SocketContext);

  const selectedUser: FirebaseUser = useSelector(
    (state: RootState) => state.selectedUserReducer.selectedUserDetails
  );

  const handleVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        context.setStream(currentStream);
        if (context.yourVideo.current)
          context.yourVideo.current.srcObject = currentStream;
      });

    db.collection("users")
      .doc(selectedUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data()?.socketID) context.startCall(doc.data()?.socketID);
          else console.log("Person if offline");
        }
      });
  };

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
      <Stack verticalAlign="center" onClick={handleVideoCall}>
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

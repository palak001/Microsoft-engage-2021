import React from "react";
import { useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { NormalHeader } from "./NormalHeader";
import { PersonalizedHeader } from "./PersonalizedHeader";

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
    return <NormalHeader />;
  else {
    return <PersonalizedHeader />;
  }
};

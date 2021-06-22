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

  if (Object.keys(selectedUser).length === 0) return <NormalHeader />;
  else {
    return <PersonalizedHeader />;
  }
};

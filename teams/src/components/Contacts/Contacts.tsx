import { Persona, PersonaSize, Stack } from "@fluentui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { getSelectedUserDetailsAction } from "../../redux-store/Chat/selectedUserReducer";
import { getSelectedUserDetails } from "../../services/chat/selectedUserServices";
import { ContactStackProp } from "./Contacts.styles";

export const Contacts: React.FunctionComponent = () => {
  const contacts = useSelector(
    (state: RootState) => state.userContactsReducer.userContacts
  );

  const dispatch = useDispatch();

  const dummyObj: FirebaseUser = {
    photoURL: "",
    displayName: "",
    uid: "",
    email: "",
  };

  return (
    <>
      <Stack
        onClick={() => {
          getSelectedUserDetails(dummyObj).then((result: FirebaseUser) => {
            dispatch(getSelectedUserDetailsAction(result));
          });
        }}
        horizontal
        {...ContactStackProp}
      >
        <Persona size={PersonaSize.size32} imageAlt="Palak, status is online" />
        New Chat
      </Stack>
      {contacts?.map((contact, id) => {
        return (
          <Stack
            onClick={() => {
              getSelectedUserDetails(contact).then((result: FirebaseUser) => {
                dispatch(getSelectedUserDetailsAction(result));
              });
            }}
            horizontal
            key={contact.uid}
            {...ContactStackProp}
          >
            <Persona
              imageUrl={contact.photoURL}
              size={PersonaSize.size32}
              // presence={PersonaPresence.online}
              imageAlt="Palak, status is online"
            />
            {contact.email}
          </Stack>
        );
      })}
    </>
  );
};

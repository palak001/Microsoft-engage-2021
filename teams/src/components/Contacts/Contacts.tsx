import { Persona, PersonaSize, Stack } from "@fluentui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FirebaseUser from "../../interfaces/user.interface";
import { RootState } from "../../redux-store";
import { getSelectedUserDetailsAction } from "../../redux-store/Chat/selectedUserReducer";
import { ContactStackProp } from "./Contacts.styles";
import { Text } from "@fluentui/react/lib/Text";

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
    socketID: "",
  };

  const handleOnClick = (obj: FirebaseUser) => {
    dispatch(getSelectedUserDetailsAction(obj));
  };

  return (
    <>
      <Stack
        onClick={() => handleOnClick(dummyObj)}
        horizontal
        {...ContactStackProp}
      >
        <Persona size={PersonaSize.size32} imageAlt="Palak, status is online" />
        <Text>New Chat</Text>
      </Stack>
      {contacts?.map((contact, id) => {
        return (
          <Stack
            onClick={() => {
              handleOnClick(contact);
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
            <Text>{contact.email}</Text>
          </Stack>
        );
      })}
    </>
  );
};

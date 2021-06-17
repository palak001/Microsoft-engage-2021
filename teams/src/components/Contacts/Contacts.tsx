import { Persona, PersonaSize, Stack } from "@fluentui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-store";
import { ContactStackProp } from "./Contacts.styles";

export const Contacts: React.FunctionComponent = () => {
  const contacts = useSelector(
    (state: RootState) => state.userContactsReducer.userContacts
  );

  return (
    <>
      {contacts?.map((contact, id) => {
        return (
          <Stack horizontal key={contact.uid} {...ContactStackProp}>
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

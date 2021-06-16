import { Stack } from "@fluentui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-store";

export const Contacts: React.FunctionComponent = () => {
  const contacts = useSelector(
    (state: RootState) => state.userContactsReducer.userContacts
  );

  return (
    <>
      {contacts?.map((contact, id) => {
        return <Stack key={contact.uid}>{contact.email}</Stack>;
      })}
    </>
  );
};

import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import FirebaseUser from "../../interfaces/user.interface";

interface FirebaseContacts {
  userContacts: Array<FirebaseUser>;
}

// Initial state
const initialState = {
  userContacts: [],
} as FirebaseContacts;

// Action
export const fetchUserContactsAction = createAction<Array<FirebaseUser>>(
  "userContacts/fetchUserContacts"
);

//Reducer
export const userContactsReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchUserContactsAction,
    (state, action: PayloadAction<Array<FirebaseUser>>) => {
      if (action.payload) {
        state.userContacts = action.payload;
      }
      return state;
    }
  );
});

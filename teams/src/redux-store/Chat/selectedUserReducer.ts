import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import FirebaseUser from "../../interfaces/user.interface";

interface selectedUser {
  selectedUserDetails: FirebaseUser;
}

// initial state
const initialState = {
  selectedUserDetails: {},
} as selectedUser;

// Action
export const getSelectedUserDetailsAction = createAction<FirebaseUser>(
  "selectedUser/getSelectedUserDetails"
);

// Reducer
export const selectedUserReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    getSelectedUserDetailsAction,
    (state, action: PayloadAction<FirebaseUser>) => {
      if (action.payload) state.selectedUserDetails = action.payload;
      return state;
    }
  );
});

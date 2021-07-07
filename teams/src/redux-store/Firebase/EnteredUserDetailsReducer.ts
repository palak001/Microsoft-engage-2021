import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import FirebaseUser from "../../interfaces/user.interface";

// Initial state
const initialState = {
  enteredUserDetails: {} as FirebaseUser,
};

// Action
export const fetchEnteredUserDetailsAction = createAction<FirebaseUser>(
  "EnteredUserDetails/fetchEnteredUserDetails"
);

//Reducer
export const enteredUserDetailsReducer = createReducer(
  initialState,
  (builder) => {
    builder.addCase(
      fetchEnteredUserDetailsAction,
      (state, action: PayloadAction<FirebaseUser>) => {
        if (action.payload) {
          state.enteredUserDetails = action.payload;
        }
        return state;
      }
    );
  }
);

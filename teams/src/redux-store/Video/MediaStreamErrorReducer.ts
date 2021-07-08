import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  mediaStreamError: "",
};
// Action
export const fetchMediaStreamErrorAction = createAction<string>(
  "mediaStreamError/fetchMediaStreamError"
);

//Reducer
export const mediaStreamErrorReducer = createReducer(
  initialState,
  (builder) => {
    builder.addCase(
      fetchMediaStreamErrorAction,
      (state, action: PayloadAction<string>) => {
        if (action.payload) {
          state.mediaStreamError = action.payload;
        }
        return state;
      }
    );
  }
);

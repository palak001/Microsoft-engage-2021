import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import controlsInterface from "../../interfaces/controls.interface";

// Initial state
const initialState = {
  mic: "on",
  camera: "on",
} as controlsInterface;
// Action
export const setControlsAction = createAction<controlsInterface>(
  "controls/setControls"
);

//Reducer
export const controlsReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    setControlsAction,
    (state, action: PayloadAction<controlsInterface>) => {
      if (action.payload) {
        state.camera = action.payload.camera;
        state.mic = action.payload.mic;
      }
      return state;
    }
  );
});

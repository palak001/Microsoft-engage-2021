import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import MeetingHistory from "../../interfaces/meetingHistory.interface";

interface MeetingHistoryInterface {
  meetingHistory: Array<MeetingHistory>;
}

// Initial state
const initialState = {
  meetingHistory: [],
} as MeetingHistoryInterface;

// Action
export const fetchMeetingHistoryAction = createAction<Array<MeetingHistory>>(
  "meetingHistory/fetchMeetingHistory"
);

//Reducer
export const meetingHistoryReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    fetchMeetingHistoryAction,
    (state, action: PayloadAction<Array<MeetingHistory>>) => {
      if (action.payload) {
        state.meetingHistory = action.payload;
      }
      return state;
    }
  );
});

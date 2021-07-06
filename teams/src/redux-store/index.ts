import { combineReducers } from "redux";
import { userContactsReducer } from "./Firebase/UserContactsReducer";
import { selectedUserReducer } from "./Chat/selectedUserReducer";
import { enteredUserDetailsReducer } from "./Firebase/EnteredUserDetailsReducer";
import { meetingHistoryReducer } from "./Firebase/MeetingHistoryReducer";

// Import other reducers

// combine all the reducers
export const rootReducer = combineReducers({
  userContactsReducer,
  selectedUserReducer,
  enteredUserDetailsReducer,
  meetingHistoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

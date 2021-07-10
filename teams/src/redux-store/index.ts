import { combineReducers } from "redux";
import { userContactsReducer } from "./Firebase/UserContactsReducer";
import { selectedUserReducer } from "./Chat/selectedUserReducer";
import { enteredUserDetailsReducer } from "./Firebase/EnteredUserDetailsReducer";
import { meetingHistoryReducer } from "./Firebase/MeetingHistoryReducer";
import { mediaStreamErrorReducer } from "./Video/MediaStreamErrorReducer";
import { controlsReducer } from "./Video/ControlsReducer";

// Import other reducers

// combine all the reducers
export const rootReducer = combineReducers({
  userContactsReducer,
  selectedUserReducer,
  enteredUserDetailsReducer,
  meetingHistoryReducer,
  mediaStreamErrorReducer,
  controlsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

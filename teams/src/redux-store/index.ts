import { combineReducers } from "redux";
import { userContactsReducer } from "./Firebase/UserContactsReducer";
import { selectedUserReducer } from "./Chat/selectedUserReducer";

// Import other reducers

// combine all the reducers
export const rootReducer = combineReducers({
  userContactsReducer,
  selectedUserReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

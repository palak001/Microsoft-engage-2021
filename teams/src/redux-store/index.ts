import { combineReducers } from "redux";
import { userContactsReducer } from "./Firebase/UserContactsReducer";

// Import other reducers

// combine all the reducers
export const rootReducer = combineReducers({
  userContactsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

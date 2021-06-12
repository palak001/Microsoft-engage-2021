import { combineReducers } from 'redux';

// Import other reducers

// combine all the reducers
export const rootReducer = combineReducers({

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
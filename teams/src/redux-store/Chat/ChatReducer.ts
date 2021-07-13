import { createReducer, createAction, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../../interfaces/chat.interface";

interface chats {
  message: Chat[];
}

// initial state
const initialState = {
  message: [],
} as chats;

// Action
export const setChatsHistory = createAction<Chat[]>(
  "chatReducer/setChatsHistory"
);

export const updateChatsHistory = createAction<Chat>(
  "chatReducer/updateChatsHistory"
);

// Reducer
export const chatReducer = createReducer(initialState, (builder) => {
  builder.addCase(setChatsHistory, (state, action: PayloadAction<Chat[]>) => {
    if (action.payload) state.message = action.payload;
    return state;
  });

  builder.addCase(updateChatsHistory, (state, action: PayloadAction<Chat>) => {
    if (action.payload) {
      const chats = state.message;
      chats.push(action.payload);
      state.message = chats;
    }
    return state;
  });
});

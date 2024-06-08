import { createSlice } from "@reduxjs/toolkit";
import { RequestPayload } from "./common/request-payload.js";

interface ConfigState {
  someAPIConfig: RequestPayload;
}

const initialState: ConfigState = {
  someAPIConfig: {
    initialCount: 0,
    targetCount: 10,
  },
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateCountRequestData: (state, action) => {
      state.someAPIConfig.initialCount = action.payload;
      state.someAPIConfig.targetCount = action.payload + 10;
    },
  },
  selectors: {
    selectAPIConfig: (state) => state.someAPIConfig,
  },
});

export const { updateCountRequestData } = configSlice.actions;
export const { selectAPIConfig } = configSlice.selectors;
export { configSlice };

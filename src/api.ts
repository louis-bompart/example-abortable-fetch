import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ResponsePayload } from "./common/response-payload.js";
import type { RequestPayload } from "./common/request-payload.js";
import { Engine, State } from "./engine.js";
import { selectAPIConfig } from "./config-slice.js";

// Define your API endpoints
export const api = createApi({
  reducerPath: "knowledgeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }), // Replace '/api' with your API base URL
  endpoints: (builder) => ({
    getAnswer: builder.query<ResponsePayload, RequestPayload>({
      queryFn: () => ({ data: { data: "", messageId: "" } }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded }) {
        await cacheDataLoaded;
        await fetchEventSource(`http://localhost:5000/sse/`, {
          method: "POST",
          body: JSON.stringify(arg),
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
          },
          fetch,
          onmessage(event) {
            updateCachedData((draft) => {
              draft.data = event.data;
            });
          },
        });
      },
    }),
  }),
});

const selectAnswerRTKQ = api.endpoints.getAnswer.select;
export const selectAnswer = (state: State) =>
  selectAnswerRTKQ(selectAPIConfig(state))(state).data;
export const { initiate: fetchAnswer } = api.endpoints.getAnswer

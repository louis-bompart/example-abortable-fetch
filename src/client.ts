import { fetchEventSource } from "@microsoft/fetch-event-source";
import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
interface Answer {
  messageId: string;
  data: string;
}
// Define your API endpoints
const api = createApi({
  reducerPath: "knowledgeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }), // Replace '/api' with your API base URL
  endpoints: (builder) => ({
    getAnswer: builder.query<Answer, void>({
      query: () => "/stream",
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded }
      ) {
        const { data } = await cacheDataLoaded;
        await fetchEventSource(`http://localhost:5000/sse/${data.messageId}`, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
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

const selectAnswer = api.endpoints.getAnswer.select;

selectAnswer();

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
  const { data } = selectAnswer()(store.getState());
  if (!data) return;
  console.log("messageId", data.messageId);
  console.log("data", data.data);
});

store.dispatch(api.endpoints.getAnswer.initiate());

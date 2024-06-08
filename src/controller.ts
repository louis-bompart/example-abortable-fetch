import { fetchAnswer, selectAnswer } from "./api.js";
import { RequestPayload } from "./common/request-payload.js";
import { selectAPIConfig, updateCountRequestData } from "./config-slice.js";
import { Engine } from "./engine.js";

export const buildController = (engine: Engine) => {
  let lastRequestPayload: RequestPayload = selectAPIConfig(engine.getState());
  engine.subscribe(() => {
    const requestPayload = selectAPIConfig(engine.getState());
    if (requestPayload !== lastRequestPayload) {
      engine.dispatch(fetchAnswer(requestPayload));
    }
  });
  return {
    get state() {
      return selectAnswer(engine.getState());
    },
    subscribe(callback: () => Promise<void>) {
      let lastState = this.state;
      engine.subscribe(() => {
        const state = this.state;
        if (state !== lastState) {
          lastState = state;
          callback();
        }
      });
    },
    updateInitialCount(initialCount: number) {
      engine.dispatch(updateCountRequestData(initialCount));
    },
  };
};

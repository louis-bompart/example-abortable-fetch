import { buildEngine } from "./engine.js";
import { buildController } from "./controller.js";

const engine = buildEngine();
const controller = buildController(engine);

controller.subscribe(async () => {
  console.log("state", controller.state);
});

controller.updateInitialCount(42);

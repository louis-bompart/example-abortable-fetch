import { fork } from "node:child_process";
import { join } from "node:path";
import.meta.dirname;
const server = fork(join(import.meta.dirname, "server/index.js"), { silent: true });
const client = fork(join(import.meta.dirname, "client/index.js"));

client.addListener("close", () => {
  server.kill();
});

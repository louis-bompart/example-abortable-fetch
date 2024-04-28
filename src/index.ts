import { fork } from "node:child_process";
import { join } from "node:path";
import.meta.dirname;
const server = fork(join(import.meta.dirname, "server.js"), { silent: true });
const client = fork(join(import.meta.dirname, "client.js"));

client.addListener("close", () => {
  server.kill();
});

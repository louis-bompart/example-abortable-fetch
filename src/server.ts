import express from "express";
import cors from "cors";
import { RequestPayload } from "./common/request-payload.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/sse/", function (req, res) {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  let { initialCount: counter, targetCount } = req.body;

  let interValID = setInterval(() => {
    counter++;
    if (counter >= targetCount) {
      clearInterval(interValID);
      res.end(); // terminates SSE session
      return;
    }
    res.write(`data: ${JSON.stringify({ num: counter })}\n\n`); // res.write() instead of res.send()
  }, 1000);

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    clearInterval(interValID);
    res.end();
  });
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});

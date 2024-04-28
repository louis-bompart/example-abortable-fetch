import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 5000;

const startedStream = new Set();

app.get("/stream", (_, res) => {
  const messageId = crypto.randomUUID();
  startedStream.add(messageId);
  return res.status(200).json({ messageId });
});

app.post("/sse/:messageId", function (req, res) {
  if (!startedStream.delete(req.params.messageId)) {
    return res.status(404).json({ message: "Stream not found" });
  }
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  let counter = 0;
  let interValID = setInterval(() => {
    counter++;
    if (counter >= 10) {
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

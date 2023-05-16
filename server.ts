"use strict";

require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const axios = require("axios");

// Constants
const PORT = 3000;
// const HOST = "192.168.123.126";
const HOST = "0.0.0.0";

const { Midjourney } = require("midjourney");

// App
const app = express();

interface QUEUE {
  prompt: string;
  id: number;
}
const queue: QUEUE[] = []; // Array to store the prompt words in the queue

// Middleware to handle the incoming requests
app.use(express.json());

app.get("/", async (req, res) => {
  // res.send("Hello World");
  const prompt = req.query.prompt;
  const id = req.query.id;
  console.log(">>>>receive prompt:", prompt);

  // Add the prompt word and requestId to the queue
  queue.push({ prompt, id });

  // Send a response with the requestId to the client
  res.json({ id });

  // Process the queue if it's not currently being processed
  if (queue.length === 1) {
    processQueue();
  }
});

// Define your execute function
async function executeFunction(promptWords: string, id: number) {
  const client = new Midjourney(
    process.env.SERVER_ID,
    process.env.CHANNEL_ID,
    process.env.SALAI_TOKEN
  );

  const msg = await client.Imagine(promptWords, (uri) => {
    console.log("loading", uri);
  });
  console.log(`Processing complete for requestId: ${id}`, { msg });

  // Once the image processing is done, send a request to the other service
  try {
    // Make a POST request to inform the other service
    await axios.post("http://other-service-url", {
      id,
      result: "image-processing-result",
    });
    console.log(`Processing complete for requestId: ${id}`);
  } catch (error) {
    console.error("Error sending request to the other service:", error);
  }
}

// Function to process the queue
async function processQueue() {
  while (queue.length > 0) {
    const { prompt, id } = queue[0];
    await executeFunction(prompt, id);
    queue.shift();
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

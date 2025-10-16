// Import Express.js
import express from "express";
import dotenv from "dotenv";

// Create an Express app
const app = express();
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get("/", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

async function newMessageReceivedN8N(message: any) {
  try {
    const url = process.env.AI_REQUEST || "";

    const headers = new Headers({
      accept: "*",
    });

    const request = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(message),
    });

    if (!request.ok) {
      return { error: "Não finalizado" };
    }

    return await request.json();
  } catch (error) {
    // Continue
  }
}
// Route for POST requests
app.post("/", async (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  const type = req?.body?.object;

  switch (type) {
    case "whatsapp_business_account":
      await newMessageReceivedN8N(req?.body).catch(() => null);
      break;
  }
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`, `\nToken: ${verifyToken}`);
});

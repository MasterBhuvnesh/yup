import express from "express";
import registerTokenRoute from "./routes/register.token";
import getTokensRoute from "./routes/get.tokens";
import healthcheckRoute from "./routes/healthcheck";
import sendPushRoute from "./routes/send.notification";
// import { authenticate } from "./middleware/auth";

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// 🔒 Apply auth globally — all routes below this will require Bearer token
// app.use(authenticate);

// Routes
app.use("/", healthcheckRoute);

//  We have direclty impelemented authentication middleware in the routes
app.use("/", sendPushRoute);
app.use("/", registerTokenRoute);
app.use("/", getTokensRoute);
app.use("*", (_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

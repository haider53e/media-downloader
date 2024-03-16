"use strict";
import "dotenv/config.js";
import "./utils/ensureEnv.js";
import "./utils/cronJobs.js";

import express from "express";
import setAttachment from "./middlewares/setAttachment.middleware.js";
import customCORS from "./middlewares/customCORS.middleware.js";
import instagramRoutes from "./routes/instagram.routes.js";
import threadsRoutes from "./routes/threads.routes.js";

const app = express.Router();

app.use(customCORS);
app.use(express.text({ type: ["text/plain", "application/json"] }));

app.use("/api/v1/instagram", instagramRoutes);
app.use("/api/v1/threads", threadsRoutes);

app.use("/media", setAttachment, express.static("media"));

export default app;

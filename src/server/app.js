"use strict";
import "dotenv/config.js";
import "./utils/ensureEnv.js";
import "./utils/cronJobs.js";

import express from "express";
import cors from "cors";
import setAttachment from "./middlewares/setAttachment.middleware.js";
import setCORPHeader from "./middlewares/setCORPHeader.middleware.js";
import instagramRoutes from "./routes/instagram.routes.js";
import threadsRoutes from "./routes/threads.routes.js";

const app = express.Router();

app.use(cors());
app.use(express.text({ type: ["text/plain", "application/json"] }));
app.use(setCORPHeader);

app.use("/api/v1/instagram", instagramRoutes);
app.use("/api/v1/threads", threadsRoutes);

app.use("/media", setAttachment, express.static("media"));
app.use("/classic", (req, res, next) => (req.url = req.url + "/") && next());

export default app;

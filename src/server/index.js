"use strict";
import "dotenv/config.js";
import "./utils/ensureEnv.js";
import "./utils/cronJobs.js";
import express from "express";
import app from "./app.js";
import getViteConfig from "./utils/getViteConfig.js";
import { expressMiddleware as multipageFallback } from "multipage-fallback";

const server = express();

const viteConfig = await getViteConfig();
server.use(viteConfig.base, app, express.static("dist"), multipageFallback());

const PORT = process.env.PORT || viteConfig.server.port;

server.listen(PORT, () => console.log("server started: http://localhost:" + PORT));

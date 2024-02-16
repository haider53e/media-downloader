"use strict";
import "dotenv/config.js";
import "./utils/ensureEnv.js";
import "./utils/cronJobs.js";
import chalk from "chalk";
import ViteExpress from "vite-express";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

ViteExpress.listen(app, PORT, () =>
  console.log("server started: http://localhost:" + PORT)
);

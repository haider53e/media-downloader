import express from "express";
import { main } from "../controllers/media.controllers.js";

const router = express.Router();

router.post("/:platform/:mediatype", main);

export default router;

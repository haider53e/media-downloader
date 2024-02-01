import express from "express";
import post from "../controllers/instagram/post.js";
import stories from "../controllers/instagram/stories.js";
import highlights from "../controllers/instagram/highlights.js";
import highlightsGroups from "../controllers/instagram/highlightsGroups.js";
import checkRequest from "../middlewares/checkRequest.middleware.js";
import audio from "../controllers/instagram/audio.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/post", checkRequest, asyncHandler(post));
router.post("/stories", checkRequest, asyncHandler(stories));
router.post("/highlights", checkRequest, asyncHandler(highlights));
router.post("/highlightsGroups", checkRequest, asyncHandler(highlightsGroups));
router.post("/audio", checkRequest, asyncHandler(audio));

export default router;

import express from "express";
import post from "../controllers/threads/post.js";
import checkRequest from "../middlewares/checkRequest.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/post", checkRequest, asyncHandler(post));

export default router;

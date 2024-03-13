import express from "express";
import nurseRoutes from "./nurseRoutes.js";

const router = express.Router()

router.use("/nurse",nurseRoutes)

export default router;
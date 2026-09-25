import express from "express";
import { data } from "../controllers/data.js";
import { verify } from "../middleware/data.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const dataRoutes = express.Router();

dataRoutes.get("/", verifyAdmin,  data)

export default dataRoutes;
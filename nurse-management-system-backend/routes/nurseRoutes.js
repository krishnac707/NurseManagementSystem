
import express from "express"
import { addNurse, deleteNurse, getAllNurses, updateNurse } from "../controllers/nurse.controllers.js";

const router = express.Router()

router.get("/get-all-nurse",getAllNurses)
router.post("/add-nurse",addNurse)
router.put("/edit-nurse/:id",updateNurse)
router.delete("/delete-nurse/:id",deleteNurse)

export default router;
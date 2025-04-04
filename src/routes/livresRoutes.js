import express from "express";
import {
    getLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
} from "../controllers/livreController.js";

const router = express.Router();

router.get("/", getLivres);
router.get("/:id", getLivreById);
router.post("/", createLivre);
router.put("/:id", updateLivre);
router.delete("/:id", deleteLivre);

export default router;
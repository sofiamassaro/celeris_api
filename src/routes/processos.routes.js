import { Router } from "express";
import * as ctrl from "../controllers/processos.controller.js";

const router = Router();

router.get("/",       ctrl.listar);
router.get("/:id",    ctrl.buscar);
router.post("/",      ctrl.criar);
router.put("/:id",    ctrl.atualizar);
router.delete("/:id", ctrl.remover);

export default router;

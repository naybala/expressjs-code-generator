import { Router } from "express";
import * as tagController from "../controllers";
import { authenticate } from "@spa/base/auth";
import { storeTagValidator, updateTagValidator } from "../validations";
import { validateRequest } from "@spa/base/validateRequest";

const router: Router = Router();

router.get("/", authenticate, tagController.index);
router.get("/:id", authenticate, tagController.show);
router.post(
  "/",
  authenticate,
  storeTagValidator,
  validateRequest,
  tagController.store
);
router.put(
  "/",
  authenticate,
  updateTagValidator,
  validateRequest,
  tagController.update
);
router.delete("/:id", authenticate, tagController.destroy);

export default router;
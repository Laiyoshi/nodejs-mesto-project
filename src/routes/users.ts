import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.patch("/me", updateUserInfo);
router.patch("/me/avatar", updateUserAvatar);

export default router;

import { Router } from "express";
import {
  getUsers,
  getUser,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from "../controllers/users";
import { regExp } from "utils/regexp";

const { celebrate, Joi } = require("celebrate");

const router = Router();

router.get("/", getUsers);
router.get("/me", getUserInfo);

router.get(
  "/:userId",
  celebrate({
    params: Joi.object({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    }),
  }),
  updateUserInfo
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object({
      avatar: Joi.string().required().pattern(regExp),
    }),
  }),
  updateUserAvatar
);

export default router;

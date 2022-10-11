import { Router } from "express";
import multer from "multer";

import uploadConfig from "../config/upload";

import { ensureAutenticated } from "../middlewares/ensureAuthenticated";
import CreateUserService from "../services/CreateUserService";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name,
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  return res.json(user);
});

// colocar middleware de validacao de sessao
usersRouter.patch(
  "/avatar",
  ensureAutenticated,
  upload.single("avatar"),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      throw new Error("You must upload a file");
    }

    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatar: file.filename,
    });

    // @ts-expect-error
    delete user.password;

    res.json(user);
  }
);

export default usersRouter;

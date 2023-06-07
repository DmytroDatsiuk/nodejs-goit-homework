const express = require("express");

const AuthController = require("../../controller/auth");

const { authenticate } = require("../../middlewares/authenticate");
const { upload } = require("../../middlewares/upload");

const router = express.Router();
const jsonParser = express.json();

const { validateBody } = require("../../utils/validateBody");

const {
  userRegisterSchema,
  userLoginSchema,
} = require("../../utils/validation/userValidationSchemas");

router.post(
  "/register",
  jsonParser,
  validateBody(userRegisterSchema),
  AuthController.register
);
router.post(
  "/login",
  jsonParser,
  validateBody(userLoginSchema),
  AuthController.login
);
router.get("/current", authenticate, AuthController.getCurrent);
router.post("/logout", authenticate, AuthController.logout);
router.patch("/update/:id", authenticate, AuthController.updateSubcription);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  AuthController.updateAvatar
);

module.exports = router;

const express = require("express");

const AuthController = require("../../controller/auth");

const { authenticate } = require("../../middlewares/authenticate");

const router = express.Router();

const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.get("/current", authenticate, AuthController.getCurrent);
router.post("/logout", authenticate, AuthController.logout);
router.patch("/:id", authenticate, AuthController.updateSubcription);

module.exports = router;

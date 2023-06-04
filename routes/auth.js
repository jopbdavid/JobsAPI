const express = require("express");
const router = express.Router();

const { register, loginUser } = require("../controllers/auth");

router.route("/login").post(loginUser);
router.route("/register").post(register);

module.exports = router;

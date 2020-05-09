const express = require("express");
const router = express.Router();
const register = require("./register");
const passport = require("passport");
const verify = passport.authenticate("jwt", { session: false });

router.post("/register", register.createUser);
router.post("/login", register.loginUser);

router.post("/recover", register.recover);
router.post("/reset/:type/:token", register.reset);

router.post("/image",verify, register.upload.single("profileImage") ,register.imageUpload);
router.delete("/image", verify, register.imageDelete);

router.get("/address", verify, register.getAddress);
router.post("/address", verify, register.addAddress);
router.delete("/address", verify, register.deleteAddress);
router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.send(req.user);
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { updateProfile } = require("../controllers/userController");
const auth = require("../middleware/auth"); // JWT middleware
const { getMyProfile, browseProfiles } = require("../controllers/userController");


router.put(
  "/profile",
  auth,
  upload.single("image"), // allows 1 image max
  updateProfile
);
router.get("/me", auth, getMyProfile);         // Get own profile
router.get("/browse", auth, browseProfiles);   // Browse other profiles

module.exports = router;
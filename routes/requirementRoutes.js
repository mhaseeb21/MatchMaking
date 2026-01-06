const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");

const {
  createRequirementPost,
  closeRequirementPost,
  getRequirementFeed,
  getMyRequirements
} = require("../controllers/requirementController");

// ✅ FIRST: My requirements
router.get("/my", auth, getMyRequirements);

// Create requirement
router.post(
  "/",
  auth,
  [
    body("genderPreference")
      .isIn(["male", "female"])
      .withMessage("Gender preference must be male or female"),
    body("minAge").isInt({ min: 18 }),
    body("maxAge")
      .isInt()
      .custom((value, { req }) => value >= req.body.minAge),
    body("city").notEmpty(),
    body("country").notEmpty(),
    body("education").notEmpty(),
    body("description").notEmpty().isLength({ max: 1000 })
  ],
  createRequirementPost
);

// Close requirement
router.patch("/:id/close", auth, closeRequirementPost);

// Browse feed (OTHERS’ posts)
router.get("/", auth, getRequirementFeed);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const { createRequirementPost,closeRequirementPost,getRequirementFeed } = require("../controllers/requirementController");

// POST /api/requirements
router.post(
  "/",
  auth, // 🔐 JWT protection
  [
    body("genderPreference")
      .isIn(["male", "female"])
      .withMessage("Gender preference must be male or female"),

    body("minAge")
      .isInt({ min: 18 })
      .withMessage("Minimum age must be at least 18"),

    body("maxAge")
      .isInt()
      .custom((value, { req }) => value >= req.body.minAge)
      .withMessage("Max age must be greater than or equal to min age"),

    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("education").notEmpty().withMessage("Education is required"),
    body("description")
      .notEmpty()
      .isLength({ max: 1000 })
      .withMessage("Description is required (max 1000 chars)")
  ],
  createRequirementPost
);

// PATCH /api/requirements/:id/close
router.patch("/:id/close", auth, closeRequirementPost);
router.get("/", auth, getRequirementFeed);

module.exports = router;

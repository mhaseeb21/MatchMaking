const mongoose = require("mongoose");

const requirementPostSchema = new mongoose.Schema(
  {
    // Who created this requirement post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Gender preference of spouse
    genderPreference: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    // Age range
    minAge: {
      type: Number,
      required: true,
      min: 18
    },
    maxAge: {
      type: Number,
      required: true
    },

    // Location preference
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },

    // Education requirement
    education: {
      type: String,
      required: true
    },

    // Description (free text)
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },

    // Post status
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("RequirementPost", requirementPostSchema);

const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequirementPost",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      maxlength: 1000
    },

    chatEnabled: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);

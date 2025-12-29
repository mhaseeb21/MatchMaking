const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      required: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);

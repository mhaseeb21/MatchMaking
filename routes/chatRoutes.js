const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const chatGuard = require("../middleware/chatGuard");

// Example: open chat for proposal
router.get("/:proposalId", auth, chatGuard, (req, res) => {
  res.json({
    msg: "Chat access granted",
    proposalId: req.params.proposalId
  });
});

module.exports = router;

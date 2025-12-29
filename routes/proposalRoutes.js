const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendProposal, updateProposalStatus } = require("../controllers/proposalController");

router.post("/", auth, sendProposal);
router.patch("/:proposalId", auth, updateProposalStatus);

module.exports = router;

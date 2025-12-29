const Proposal = require("../models/Proposal");

const chatGuard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { proposalId } = req.params;

    // 1️⃣ Find proposal
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    // 2️⃣ Chat must be enabled
    if (!proposal.chatEnabled) {
      return res.status(403).json({ msg: "Chat not enabled for this proposal" });
    }

    // 3️⃣ Only sender or receiver can chat
    const isSender = proposal.sender.toString() === userId;
    const isReceiver = proposal.receiver.toString() === userId;

    if (!isSender && !isReceiver) {
      return res.status(403).json({ msg: "Not authorized to access this chat" });
    }

    // 4️⃣ Attach proposal to request (optional but useful)
    req.proposal = proposal;

    next(); // ✅ allow chat
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = chatGuard;

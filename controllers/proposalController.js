const Proposal = require("../models/Proposal");
const RequirementPost = require("../models/RequirementPost");

exports.sendProposal = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { postId, message } = req.body;

    // 1️⃣ Check post exists & open
    const post = await RequirementPost.findById(postId);
    if (!post || post.status !== "open") {
      return res.status(404).json({ msg: "Post not available" });
    }

    // 2️⃣ Prevent proposing to own post
    if (post.user.toString() === senderId) {
      return res.status(400).json({ msg: "You cannot propose to your own post" });
    }

    // 3️⃣ Prevent duplicate proposal
    const existing = await Proposal.findOne({
      post: postId,
      sender: senderId
    });

    if (existing) {
      return res.status(400).json({ msg: "Proposal already sent" });
    }

    // 4️⃣ Create proposal
    const proposal = await Proposal.create({
      post: postId,
      sender: senderId,
      receiver: post.user,
      message
    });

    res.status(201).json({
      msg: "Proposal sent successfully",
      proposal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateProposalStatus = async (req, res) => {
    console.log("updateProposalStatus called");
  try {
    const userId = req.user.id;
    const { proposalId } = req.params;
    const { status } = req.body; // accepted | rejected

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    // Only receiver can accept/reject
    if (proposal.receiver.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Must be pending
    if (proposal.status !== "pending") {
      return res.status(400).json({ msg: "Proposal already processed" });
    }

    proposal.status = status;

    // Enable chat ONLY if accepted
    if (status === "accepted") {
      proposal.chatEnabled = true;
    }

    await proposal.save();

    res.json({
      msg: `Proposal ${status} successfully`,
      proposal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

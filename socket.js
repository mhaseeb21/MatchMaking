const jwt = require("jsonwebtoken");
const Proposal = require("./models/Proposal");
const ChatMessage = require("./models/ChatMessage");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.id);

    socket.on("joinRoom", async ({ proposalId }) => {
      const proposal = await Proposal.findById(proposalId);

      if (
        !proposal ||
        !proposal.chatEnabled ||
        ![proposal.sender.toString(), proposal.receiver.toString()].includes(
          socket.user.id
        )
      ) {
        return socket.emit("error", "Chat not allowed");
      }

      socket.join(proposalId);
      socket.emit("joined", proposalId);
    });

    socket.on("sendMessage", async ({ proposalId, message }) => {
      const msg = await ChatMessage.create({
        proposal: proposalId,
        sender: socket.user.id,
        message
      });

      io.to(proposalId).emit("newMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.user.id);
    });
  });
};

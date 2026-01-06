import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendProposal,
  resetProposalState
} from "../../features/proposal/proposalSlice";

const SendProposalModal = ({ postId, onClose }) => {
  const dispatch = useDispatch();
  const { sending, error, success } = useSelector(
    (state) => state.proposals
  );

  const [message, setMessage] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    dispatch(resetProposalState());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    dispatch(sendProposal({ postId, message }));
  };

  // Close modal on success
  useEffect(() => {
    if (success) {
      setMessage("");
      setTimeout(() => {
        dispatch(resetProposalState());
        onClose();
      }, 800);
    }
  }, [success, dispatch, onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        
        <h2 className="text-xl font-semibold mb-4">
          Send Proposal
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            rows="5"
            placeholder="Write a short message..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SendProposalModal;

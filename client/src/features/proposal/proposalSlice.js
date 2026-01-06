import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ======================
   THUNKS
====================== */

// Send proposal
export const sendProposal = createAsyncThunk(
  "proposals/send",
  async ({ postId, message }, thunkAPI) => {
    try {
      const res = await api.post("/proposals", {
        postId,
        message
      });
      return res.data.proposal;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to send proposal"
      );
    }
  }
);

const proposalSlice = createSlice({
  name: "proposals",
  initialState: {
    sending: false,
    error: null,
    success: false
  },
  reducers: {
    resetProposalState: (state) => {
      state.sending = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendProposal.pending, (state) => {
        state.sending = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendProposal.fulfilled, (state) => {
        state.sending = false;
        state.success = true;
      })
      .addCase(sendProposal.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  }
});

export const { resetProposalState } = proposalSlice.actions;
export default proposalSlice.reducer;

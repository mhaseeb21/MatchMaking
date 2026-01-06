import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* =======================
   THUNKS
======================= */

// 🔹 Fetch my requirements (open | closed)
export const fetchMyRequirements = createAsyncThunk(
  "requirements/fetchMy",
  async (status = "open", thunkAPI) => {
    try {
      const res = await api.get(`/requirements/my?status=${status}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to load my requirements"
      );
    }
  }
);

// 🔹 Close requirement
export const closeRequirement = createAsyncThunk(
  "requirements/close",
  async (postId, thunkAPI) => {
    try {
      await api.patch(`/requirements/${postId}/close`);
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to close post"
      );
    }
  }
);

// 🔹 Fetch requirement feed (active posts of other users)
export const fetchRequirementFeed = createAsyncThunk(
  "requirements/fetchFeed",
  async ({ page = 1, filters = {} }, thunkAPI) => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      }).toString();

      const res = await api.get(`/requirements?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to load feed"
      );
    }
  }
);

/* =======================
   SLICE
======================= */

const requirementSlice = createSlice({
  name: "requirements",
  initialState: {
    // My posts
    myPosts: [],

    // Feed posts
    feedPosts: [],
    page: 1,
    totalPages: 1,

    loading: false,
    error: null
  },
  reducers: {
    // 🔄 Reset feed when filters change or page reload
    resetFeed: (state) => {
      state.feedPosts = [];
      state.page = 1;
      state.totalPages = 1;
    }
  },
  extraReducers: (builder) => {
    builder

      /* =====================
         MY REQUIREMENTS
      ===================== */
      .addCase(fetchMyRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload;
      })
      .addCase(fetchMyRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(closeRequirement.fulfilled, (state, action) => {
        state.myPosts = state.myPosts.map((post) =>
          post._id === action.payload
            ? { ...post, status: "closed" }
            : post
        );
      })

      /* =====================
         REQUIREMENT FEED
      ===================== */
      .addCase(fetchRequirementFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequirementFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;

        state.feedPosts = [
          ...state.feedPosts,
          ...action.payload.posts
        ];
      })
      .addCase(fetchRequirementFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetFeed } = requirementSlice.actions;
export default requirementSlice.reducer;

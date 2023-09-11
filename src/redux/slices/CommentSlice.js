import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchComments = createAsyncThunk('comments/fetchComments', async() => {
  const {data} = await axios.get('/comments');
  return data;
})

export const fetchCommentsCreate = createAsyncThunk('comments/fetchCommentsCreate', async(params) => {
  const {data} = await axios.post('/comments/create', params);
  return data;
})

const initialState = {
  comments: [],
  status: 'loading'
};

const commentsSlice = createSlice({
  name: 'comments', initialState,
  reducers: {
    addComment(state, action) {
      state.comments.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
        state.comments = [];
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.status = 'error';
        state.comments = [];
      })

      .addCase(fetchCommentsCreate.pending, (state) => {
        state.status = 'loading';
      })
  }
})
export const {addComment} = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;
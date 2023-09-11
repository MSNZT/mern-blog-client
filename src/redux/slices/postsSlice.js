import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
  const {data} = await axios.get('/posts');
  return data;
})

export const fetchTags = createAsyncThunk('tags/fetchPosts', async() => {
  const {data} = await axios.get('/posts/tags');
  return data;
})
export const fetchRemovePost = createAsyncThunk('post/fetchRemovePost', async(id) => {
  await axios.delete(`/post/${id}`);
})

export const fetchPostsPopular = createAsyncThunk('post/fetchPostsPopular', async() => {
  const {data} = await axios.get(`/posts?sort=popular`);
  return data;
})
export const fetchRemoveImage = createAsyncThunk('remove/fetchRemoveImage', async(params) => {
  await axios.post(`/remove`, params);
})

export const fetchPostsWithTags = createAsyncThunk('posts/fetchPostsWithTags', async(params) => {
  const {data} = await axios.get(`/tags/${params}`);
  return data;
})

const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // Загрузка постов
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.status = 'loaded';
        state.posts.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.status = 'error';
        state.posts.items = [];
      })

      // Загрузка постов по тэгам
      .addCase(fetchPostsWithTags.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPostsWithTags.fulfilled, (state, action) => {
        state.posts.status = 'loaded';
        state.posts.items = action.payload;
      })
      .addCase(fetchPostsWithTags.rejected, (state) => {
        state.posts.status = 'error';
        state.posts.items = [];
      })

      // Загрузка постов по популярности
      .addCase(fetchPostsPopular.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchPostsPopular.fulfilled, (state, action) => {
        state.posts.status = 'loaded';
        state.posts.items = action.payload;
      })
      .addCase(fetchPostsPopular.rejected, (state) => {
        state.posts.status = 'error';
        state.posts.items = [];
      })

      // Загрузка тэгов
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.status = 'loaded';
        state.tags.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.status = 'error';
        state.tags.items = [];
      })

    // Удаление поста
      .addCase(fetchRemovePost.pending, (state) => {
        state.posts.status = 'loading';
      })
      .addCase(fetchRemovePost.fulfilled, (state, action) => {
        state.posts.status = 'loaded';
        state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg);
      })
      .addCase(fetchRemovePost.rejected, (state) => {
        state.posts.status = 'error';
      })

      // Удаление картинки
      .addCase(fetchRemoveImage.pending, (state) => {
        state.posts.status = 'loading';
      })
  }
})

export const postReducer = postsSlice.reducer;
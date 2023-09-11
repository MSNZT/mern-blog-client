import {configureStore} from "@reduxjs/toolkit";
import {postReducer} from "./slices/postsSlice";
import {authReducer} from "./slices/authSlice";
import {commentsReducer} from "./slices/CommentSlice";

const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    comments: commentsReducer
  }
})

export default store;
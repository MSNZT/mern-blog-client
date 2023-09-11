import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {useDispatch, useSelector} from "react-redux";
import {
  fetchPosts,
  fetchPostsPopular, fetchPostsWithTags,
  fetchTags
} from "../redux/slices/postsSlice";
import {useParams} from "react-router-dom";

const tabs = ['Новые', 'Популярные'];

export const Home = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const {posts, tags} = useSelector(state => state.posts)
  const {data} = useSelector(state => state.auth);
  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const [activeTabs, setActiveTabs] = useState(0);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  useEffect(() => {
    dispatch(fetchPostsWithTags(id))
  }, [id]);

  useEffect(() => {
    if (activeTabs === 0) {
      dispatch(fetchPosts())
    } else {
      dispatch(fetchPostsPopular())
    }
  }, [activeTabs])
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={activeTabs} aria-label="basic tabs example">
        {tabs.map((tab, i) => <Tab key={i} label={tab} onClick={() => setActiveTabs(i)} />)}
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, i) => (
            isPostLoading ? (<Post key={i} isLoading={true}/>) : (
                <Post
                  key={obj._id}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? obj.imageUrl: ''}
                  user={obj.user}
                  createdAt={new Date(obj.createdAt).toLocaleString()}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.comments.length}
                  tags={obj.tags}
                  isEditable={data?._id === obj.user._id}
                />
              )
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          {/*<CommentsBlock*/}
          {/*  items={[*/}
          {/*    {*/}
          {/*      user: {*/}
          {/*        fullName: 'Вася Пупкин',*/}
          {/*        avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',*/}
          {/*      },*/}
          {/*      text: 'Это тестовый комментарий',*/}
          {/*    },*/}
          {/*    {*/}
          {/*      user: {*/}
          {/*        fullName: 'Иван Иванов',*/}
          {/*        avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',*/}
          {/*      },*/}
          {/*      text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*  isLoading={false}*/}
          {/*/>*/}
        </Grid>
      </Grid>
    </>
  );
};

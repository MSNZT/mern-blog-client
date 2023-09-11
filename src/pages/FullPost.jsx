import React, {useEffect, useState} from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import {useParams} from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import {useSelector} from "react-redux";

export const FullPost = () => {
  const {id} = useParams();
  const [data, setData] = useState({});
  const auth = useSelector(state => state.auth);
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const handleComments = (value) => {
    console.log(comments)
    setComments(oldArray => [...oldArray, {text: value, user: {fullName: auth.data.fullName, avatarUrl: auth.data.avatarUrl}}]);
    console.log(comments)
  }

  useEffect(() => {
    axios.get(`/post/${id}`).then(res => {
      setLoading(false);
      setData(res.data)
      setComments(res.data.comments);
    }).catch(err => {
      console.warn(err);
      alert('Ошибка при получении статьи');
    })
  }, []);

  if (isLoading) {
    return <Post isLoading={true} />
  }
  return (
    <>
      <Post
        id={data.id}
        title={data.title}
        imageUrl={data.imageUrl ? data.imageUrl: ''}
        user={data.user}
        createdAt={new Date(data.createdAt).toLocaleString()}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={false}
      >
        <Index onClick={handleComments}/>
      </CommentsBlock>
    </>
  );
};

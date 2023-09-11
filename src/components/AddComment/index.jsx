import React, {useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {addComment, fetchCommentsCreate} from "../../redux/slices/CommentSlice";

export const Index = ({onClick}) => {
  const dispatch = useDispatch()
  const {id} = useParams();
  const {data} = useSelector(state => state.auth);
  const [authMessage, setAuthMessage] = useState(false);
  const {register, handleSubmit, setValue, formState: {errors}} = useForm();

  const submit = ({text}) => {
    if (data) {
      const obj = {
        text: text,
        _id: id
      }
      dispatch(fetchCommentsCreate(obj));
      dispatch(addComment({text, user: {
          fullName: data.fullName,
          avatarUrl: data.avatarUrl
        }}))
      setValue('text', '');
      onClick(text)
    } else {
      setAuthMessage(true);
      setValue('text', '');
      return
    }
  }
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={data && data.avatarUrl}
        />
        <div className={styles.form}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Написать комментарий"
              variant="outlined"
              maxRows={10}
              multiline
              fullWidth
              helperText={errors.text?.message}
              {...register('text', {required: true, minLength: {
                value: 5,
                message: 'Минимальная длина поля 5 символов'
                }}
              )}
            />
            {authMessage && <p>Вы не авторизованы</p>}
            <Button type='submit' variant="contained">Отправить</Button>
          </form>
        </div>
      </div>
    </>
  );
};

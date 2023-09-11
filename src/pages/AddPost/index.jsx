import React, {useEffect, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/authSlice";
import {useForm} from "react-hook-form";
import axios from "../../axios";

export const AddPost = () => {
  const {id} = useParams();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('');
  const [isFile, setFile] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm({mode: "onChange"});

  const inputFileRef = useRef(null);
  const inputRef = register("file", {
    validate: (value) => handleChangeFile(value)
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      axios.get(`/post/${id}`).then(({data}) => {
        if (data.imageUrl) {
          setImageUrl(`${process.env.REACT_APP_API_URL}${data.imageUrl}`);
          setFile(data.imageUrl.substring(1))
        }
        setText(data.text);
        setValue('title', data.title);
        setValue('tags', data.tags.join(','));
      }).catch(err => {
        console.log(err)
        return 'Ошибка при загрузке статьи'
      })
    }
  }, []);

  const handleChangeFile = (value) => {
    const file = value[0];
    if (!file) return;
    const acceptedFormats = ["image/png", "image/jpeg"];
    if (!acceptedFormats.includes(file.type)) {
      return "Неверный формат изображения";
    }
    if (file.size > 2000000) {
      return "Превышен размер изображения";
    }
    setImageUrl(URL.createObjectURL(file));
  };
  const onClickRemoveImage = async () => {
    setImageUrl('');
    inputFileRef.current.value = ''
    if (isFile) {
      setImageUrl('')
      setFile(null)
      await axios.post(`/remove`, {path: isFile})
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(() => ({
    spellChecker: false,
    maxHeight: '400px',
    autofocus: true,
    placeholder: 'Введите текст...',
    status: false,
    autosave: {
      enabled: true, delay: 1000,
    },
  }), [],);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }

  const onSubmit = async (value) => {
    try {
      const {tags, title, file} = value;
      let fileData = null;
      let data = null;
      if (file[0]) {
        fileData = new FormData();
        fileData.append('image', file[0]);
        data = await axios.post("/upload", fileData);
      }
      console.log(value)
      const obj = {
        title,
        text: text,
        tags: tags.replaceAll(' ', ''),
        imageUrl: data?.data.url ? data.data.url : isFile ? isFile : ''
      }
      if (!tags) {
        delete obj.tags
      }
      console.log(obj)
      const post = isEditing ? await axios.patch(`/post/${id}`, obj) : await axios.post("/post/create", obj)
      const _id = isEditing ? id : post.data._id
      navigate(`/post/${_id}`)
    } catch (e) {
      console.log(e);
      alert('Ошибка при создании статьи')
    }
  }

  return (<Paper style={{padding: 30}}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button onClick={() => inputFileRef.current?.click()} variant="outlined" size="large"
              style={{marginRight: '10px'}}>
        Загрузить превью
      </Button>
      <input
        type="file"
        name="file"
        {...inputRef}
        ref={(e) => {
          inputRef.ref(e);
          inputFileRef.current = e;
        }}
        id='input-field'
        hidden
        accept="image/png, image/jpeg"
      />
      {imageUrl && (<Button variant="contained" color="error" onClick={onClickRemoveImage}>
        Удалить
      </Button>)}
      <div className={styles.warning}>Максимальный размер файла 2 мб. (png, jpeg, webp)</div>
      {errors.file && <div>{errors.file.message}</div>}
      {imageUrl && (<img className={styles.image} src={imageUrl} alt="Uploaded"/>)}
      <br/>
      <br/>
      <TextField
        classes={{root: styles.title}}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        {...register('title', {
          required: true
        })}
      />
      <TextField
        classes={{root: styles.tags}}
        variant="standard" placeholder="Тэги: пример - природа, закат"
        fullWidth
        {...register('tags', {
          required: false,
        })}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button type='submit' size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </form>
  </Paper>);
};

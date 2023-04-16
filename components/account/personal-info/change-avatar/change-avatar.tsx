import React, { FC, useContext, useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { RiImageEditFill } from 'react-icons/ri';

import UserAvatar from 'components/user-avatar';
import { api } from 'api';
import { useWindowSize } from 'hooks/useWindowSize';
import { UserContext } from '../../../context/user-context';
import styles from './change-avatar.module.scss';
import { useDispatch } from 'react-redux';
import {
  dataOkResponseAvatar,
  dataErrorResponseAvatar,
} from '../../../../store/reducers/avatar.reducer';

const ChangeAvatar: FC = () => {
  const { user, setGlobalUser } = useContext(UserContext);
  const [error, setError] = useState<string>('');
  const [inputKey, setInputKey] = useState(Date.now());
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState<null | string>(null);
  const [updatedAvatar, setUpdatedAvatar] = useState<boolean>(false);

  const updatePictureAvatar = () => {
    let isLoaded = true;
    api.user.getUser().then(({ data }) => {
      if (isLoaded) {
        setGlobalUser(data);
        if (data?.avatar?.name) setAvatar(data.avatar.name);
        setUpdatedAvatar(false);
      }
    });
    return () => {
      isLoaded = false;
    };
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    const imageSize = e.target.files[0]?.size;
    const imageAvailableFormats = e.target.accept
      .split(',')
      .map((e) => e.replace(/\./g, '').trim());
    const imageFormat = e.target.files[0].type.replace(/image[/]/, '');

    if (!imageAvailableFormats.includes(imageFormat)) {
      setError('Підтримувані формати фото: png, jpg, jpeg, gif');
      return;
    } else {
      setError('');
    }

    if (imageSize && imageSize > 10000000) {
      setError('Розмір зображення не повинен перевищувати 10 Мб');
      return;
    } else {
      setError('');
    }
    const imageFD = new FormData();

    imageFD.append('image', e.target.files[0]);
    const updatedUser = { ...user };

    const avatarName = await api.user.uploadAvatar(imageFD);
    if (avatarName.data) {
      updatedUser.avatar = { name: avatarName.data.message };
      dispatch(dataOkResponseAvatar(avatarName.data.message));
      setGlobalUser(updatedUser);
      setInputKey(Date.now());
      setUpdatedAvatar(true);
    } else {
      dispatch(dataErrorResponseAvatar(avatarName));
    }
  };

  const onDelete = async () => {
    if (!user || !user.avatar) return;
    const updatedUser = { ...user };
    updatedUser.avatar = null;
    setGlobalUser(updatedUser);
    await api.user.deleteAvatar();
    setError('');
    setUpdatedAvatar(true);
    setAvatar(null);
  };

  const { width } = useWindowSize();

  useEffect(() => {
    if (updatedAvatar) {
      updatePictureAvatar();
    }
  }, [updatedAvatar]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles['avatar-btn-wrapper']}>
          <div className={styles['avatar-wrapper']}>
            <UserAvatar size="150" avatar={avatar} />
            <label htmlFor="avatar" className={styles['avatar-overlay']}>
              <span>
                <RiImageEditFill size={width > 575 ? 30 : 20} color="white" />
              </span>
              <input
                id="avatar"
                type="file"
                onChange={onUpload}
                accept=".png, .jpg, .jpeg, .gif"
                key={inputKey}
              />
            </label>
          </div>
          <span className={styles['delete-img']} onClick={onDelete}>
            <MdDelete size={width > 575 ? 24 : 18} color="red" />
          </span>
        </div>
      </div>
      {error ? (
        <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
      ) : (
        <div style={{ color: 'grey', fontSize: '12px' }}>
          <div>* Розмір фото не має перевищувати 10 Мб</div>
          <div>* Підтримувані формати фото: png, jpg, jpeg, gif</div>
        </div>
      )}
    </>
  );
};

export default ChangeAvatar;

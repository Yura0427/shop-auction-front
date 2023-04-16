import React, { FC, useContext, useEffect, useState } from 'react';
import Avatar, { ConfigProvider } from 'react-avatar';
import Image from 'next/image';
import type * as CSS from 'csstype';

import apiUrl from 'api/config';
import { UserContext } from './context/user-context';
import { api } from 'api';

interface UserAvatarProps {
  size?: string;
  avatar?: string | null;
}

const avatarStyle: CSS.Properties = {
  borderRadius: '50%',
};

const UserAvatar: FC<UserAvatarProps> = ({ size = '45', avatar }) => {
  const { user, setGlobalUser } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState<string | null | undefined>(null);

  useEffect(() => {
    let isLoaded = true;
    api.user.getUser().then(({ data }) => {
      if (isLoaded) {
        setGlobalUser(data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  useEffect(() => {
    setUserAvatar(user?.avatar?.name);
  }, []);

  useEffect(() => {
    if ((!avatar && user?.avatar?.name) || user?.avatar?.name) {
      setUserAvatar(user.avatar.name);
    } else {
      setUserAvatar(avatar);
    }
  }, [avatar, user]);

  return (
    <>
      {user ? (
        userAvatar ? (
          <>
            <Image
              width={size}
              height={size}
              src={`${apiUrl}/static/uploads/avatar/${userAvatar}`}
              alt="avatar"
              style={avatarStyle}
            />
          </>
        ) : (
          <ConfigProvider avatarRedirectUrl="https://avatar-redirect.appspot.com">
            <Avatar
              googleId={user.googleId}
              facebookId={user.facebookId}
              name={`${user.lastName} ${user.firstName}`}
              size={size}
              round={true}
            />
          </ConfigProvider>
        )
      ) : null}
    </>
  );
};

export default UserAvatar;

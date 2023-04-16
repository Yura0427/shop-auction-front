import React, { FC, useContext } from 'react';

import UserAvatar from 'components/user-avatar';
import { EAccountUrls } from 'interfaces/account/account.enum';
import styles from './user-block.module.scss';
import { UserContext } from '../context/user-context';
import Route from '../route/Route';

interface UserBlockProps {
  closeSideMenu: () => void;
}

const UserBlock: FC<UserBlockProps> = ({ closeSideMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles['user']}>
      <span className={styles.placeholder}>
        <UserAvatar />
      </span>

      <div className={styles['user-block']}>
        <Route
          href={`/account/${EAccountUrls.personalInfo}`}
          linkClass={styles['user-name']}
          onClick={closeSideMenu}
        >
          {`${user?.lastName} ${user?.firstName}`}
        </Route>
        <p className={styles['user-email']}>{user?.email}</p>
      </div>
    </div>
  );
};

export default UserBlock;

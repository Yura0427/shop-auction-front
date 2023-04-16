import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import styles from './go-back-btn.module.scss';
import Route from '../route/Route';

const GoBackBtn = () => {
  return (
    <Route href="/" linkClass={styles['go-back-btn']}>
      <IoIosArrowBack />
      На головну
    </Route>
  );
};

export default GoBackBtn;

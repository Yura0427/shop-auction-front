import React, { FC } from 'react';
import { Alert } from 'reactstrap';
import styles from './snackBar.module.scss';



interface SnackBarProps {
  message: string,
  success: boolean,
}

const SnackBar: FC<SnackBarProps> = ({ message, success }) => {

  return (
    <div className={styles.snackBarContainer}>
      <Alert color={success ? 'success' : 'danger'}>
        {message}
      </Alert>
    </div>
  );
};

export default SnackBar;

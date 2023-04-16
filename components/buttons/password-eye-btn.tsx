import React, { FC, MouseEventHandler } from 'react';
import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs';
import styles from './password-eye-btn.module.scss';
import classnames from 'classnames';

interface PasswordEyeProps {
  passwordShown: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  customClass?: boolean;
}

const PasswordEyeIcon: FC<PasswordEyeProps> = ({ passwordShown, onClick, customClass }) => {
  return (
    <button
      onClick={onClick}
      type={'button'}
      className={classnames(
        styles.eyeBtn,
        { [styles.active]: passwordShown },
        {
          [styles.error]: customClass,
        }
      )}
    >
      {passwordShown ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
    </button>
  );
};

export default PasswordEyeIcon;

import { FC, useState, useEffect } from 'react';
import { Button, Spinner } from 'reactstrap';
import styles from './resend-message-btn.module.scss';

interface ResendMessageButton {
  isTimer: boolean;
  action: any;
  submit: any;
  title: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  spinnerColor: string;
}

export const ResendMessageButton: FC<ResendMessageButton> = ({
  isTimer,
  action,
  submit,
  title,
  type,
  spinnerColor,
}) => {
  const [timer, setTimer] = useState<number>(60);

  useEffect(() => {
    timer && isTimer
      ? setTimeout(() => {
          setTimer(timer - 1);
        }, 1000)
      : action();
  }, [timer, isTimer]);

  return (
    <Button
      disabled={isTimer && timer ? true : false}
      className={styles.resendMessage__btn}
      type={type}
      onClick={submit}
      color="primary"
    >
      {isTimer && timer ? (
        <div className={styles.resendMessage__timerBlock}>
          <Spinner className={styles.spinner} size="lg" color={spinnerColor} />
          <span className={styles.resendMessage__timer}>{timer}</span>
        </div>
      ) : (
        title
      )}
    </Button>
  );
};

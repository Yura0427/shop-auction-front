import React, { FC, useEffect, useState } from 'react';
import { Button, Spinner } from 'reactstrap';

import { IPopoverState } from '../../../interfaces/user/auth';
import { api } from '../../../api';

import classes from '@forms/auth/auth.module.scss';

interface ResendMessageProps {
  popoverState?: IPopoverState;
  formik: any;
}

const ResendMessage: FC<ResendMessageProps> = ({ popoverState, formik }) => {
  const [timer, setTimer] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const resendMessage = async () => {
    setIsDisabled(true);
    setTimer(60);
    const email = formik.values.email;
    await api.user.resendMessage(email);
  };

  useEffect(() => {
    timer > 0 && isDisabled
      ? setTimeout(() => {
          setTimer((timer) => timer - 1);
        }, 1000)
      : setIsDisabled(false);
  }, [timer, isDisabled]);

  return (
    <>
      {popoverState?.statusCode === 406 ? (
        <div className={classes.resendMessage__block}>
          <div className={classes.form__message}>
            <span>Перейдіть на пошту для завершення реєстрації!</span>
          </div>
          <Button
            disabled={isDisabled}
            className={classes.resendMessage__btn}
            type="button"
            onClick={resendMessage}
          >
            {timer ? (
              <div className={classes.resendMessage__timerBlock}>
                <Spinner className={classes.spinner} size="lg" color="primary" />
                <span className={classes.resendMessage__timer}>{timer}</span>
              </div>
            ) : (
              'Надіслати лист повторно'
            )}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default ResendMessage;

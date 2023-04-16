import React, { FC, useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Form, Spinner } from 'reactstrap';
import { MdEdit } from 'react-icons/md';

import AppInput from 'components/inputs/app-input';
import styles from './change-email.module.scss';
import { UserContext } from '../../../context/user-context';
import { api } from '../../../../api';

const SendChangeEmail: FC = () => {
  const { user } = useContext(UserContext);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [visible, setVisible] = useState(false);
  const [resend, setResend] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isFirstChange, setIsFirstChange] = useState<boolean>(true);

  useEffect(() => {
    timer && isDisabled
      ? setTimeout(() => {
          setTimer((timer) => timer - 1);
        }, 1000)
      : setIsDisabled(false);
  }, [timer]);

  const toggleVisible = () => {
    setVisible(!visible);
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  async function onSubmit(values: any) {
    const newEmail = values.email;
    if (!email) {
      setEmail(newEmail);
    }
    const { data, error } = await api.user.sendRequestChangeEmail({
      newEmail,
      userId: user?.id as number,
    });
    if (!error) {
      setResend(true);
    }

    if (!error && !isFirstChange) {
      setIsDisabled(true);
      setTimer(60);
    } else {
      setIsFirstChange(false);
    }

    if (error) {
      setResponseMessage(error.message);
      setError(error.message);
      toggleVisible();
      setEditMode(false);
    } else {
      setResponseMessage(data.message);
      setError(null);
      setEditMode(false);
      toggleVisible();
    }
  }

  const formik = useFormik({
    initialValues: {
      email: user ? user.email : '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .trim()
        .email('Неправильна адреса')
        .required('Це поле не повинно бути пустим'),
    }),
    onSubmit,
  });

  return (
    <div className={styles.container}>
      {!editMode && (
        <span className={styles['edit-btn']} onClick={() => setEditMode(true)}>
          <MdEdit size={23} color="grey" />
        </span>
      )}

      {editMode ? (
        <Form onSubmit={formik.handleSubmit}>
          <AppInput formik={formik} field="email" label="Електронна пошта" type="email" />

          <div className={styles['btn-wrapper']}>
            <Button type="submit" color="primary" className={styles['save-btn']}>
              Змінити пошту
            </Button>
            <Button type="button" color="secondary" onClick={() => setEditMode(false)}>
              Скасувати
            </Button>
          </div>
        </Form>
      ) : (
        <div className={styles.content}>
          <Alert color={error ? 'danger' : 'success'} isOpen={visible}>
            <h6>{responseMessage}</h6>
          </Alert>
          <p>
            <span>Електронна пошта</span>
            <span>{user ? user.email : ''}</span>
          </p>
          {resend ? (
            <>
              <Button
                className={styles.resendMessage__btn}
                disabled={isDisabled}
                onClick={() => onSubmit({ email })}
                type="button"
                color="primary"
              >
                {timer ? (
                  <div className={styles.resendMessage__timerBlock}>
                    <Spinner className={styles.spinner} size="lg" color="light" />
                    <span className={styles.resendMessage__timer}>{timer}</span>
                  </div>
                ) : (
                  'Надіслати лист повторно'
                )}
              </Button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SendChangeEmail;

import React, { FC, useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import Footer from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import MainLayout from 'components/layout/MainLayout';
import { useCategories } from 'hooks/useCategories';
import classes from './auth.module.scss';
import { Alert, Button, Form, Popover, PopoverBody } from 'reactstrap';
import AppInput from 'components/inputs/app-input';
import { api } from 'api';
import Route from '../../route/Route';
import { UserContext } from '../../context/user-context';
import { useRouter } from 'next/router';
import { ResendMessageButton } from 'components/buttons/resend-message-btn';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Неправильна адреса!').required('Це поле не повинно бути пустим!'),
});

export const ForgotPasswordForm: FC = () => {
  const [visible, setVisible] = useState(false);
  const onShow = () => setVisible(true);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverState, setPopoverState] = useState(
    'Користувач з такою електронною поштою не зареєстрований!'
  );
  const [isVisibleResend, setVisibleResend] = useState(false);
  const [isTimer, setIsTimer] = useState(false);

  const togglePop = () => setPopoverOpen(!popoverOpen);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { data } = await api.user.requestPasswordInstall(values);

      if (isVisibleResend) {
        setIsTimer(true);
      }

      if (!data.success) {
        setPopoverState(data.message);
        togglePop();
        setTimeout(() => {
          setPopoverOpen(false);
        }, 5000);
        return;
      }

      resetForm();
      onShow();

      setVisibleResend(true);
    },
  });
  const { allCategories } = useCategories();

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  const metaData = {
    title: 'Відновлення паролю',
    description: 'Сторінка відновлення паролю',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <Header categories={allCategories!} />

      <div className={classes.container}>
        <Form className={classes.container__forgotForm} onSubmit={formik.handleSubmit}>
          <Alert color="success" isOpen={visible}>
            <h6>Дякуємо! Лист з посиланням на встановлення паролю відправлено Вам на пошту!</h6>
          </Alert>
          <span>
            Будь ласка, введіть Вашу адресу електронної пошти, ми відправимо Вам посилання для
            відновлення паролю:
          </span>
          <AppInput type="email" formik={formik} field="email" label="" placeholder="" />
          <Popover placement="bottom" isOpen={popoverOpen} target="Popover">
            <PopoverBody>{popoverState}</PopoverBody>
          </Popover>
          {!isVisibleResend ? (
            <Button id="Popover" type="submit" color="primary" className={classes.submitBtn}>
              Надіслати
            </Button>
          ) : (
            <ResendMessageButton
              isTimer={isTimer}
              title="Надіслати лист ще раз"
              action={() => setIsTimer(false)}
              submit={formik.handleSubmit}
              type="submit"
              spinnerColor="light"
            />
          )}
        </Form>
        <div className={classes.goBackWrapper}>
          <Route href="/">
            <span className={classes.back}>На головну</span>
          </Route>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
};

import React, { FC, useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Alert, Button, Col, Form, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

import AppInput from 'components/inputs/app-input';
import { api } from 'api';
import { UserContext } from 'components/context/user-context';
import { setUser } from 'services/local-storage-controller';
import MainLayout from 'components/layout/MainLayout';
import { Header } from 'components/Header/Header';
import { useCategories } from 'hooks/useCategories';
import Footer from 'components/Footer/Footer';

import classes from './auth.module.scss';
import { IResponseMessage } from 'interfaces/user/userData';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .test(
      'regex',
      'Пароль має бути не менше 6 символів, містити цифри, великі літери та хоча б один із спецсимволів: (#?!@$%^&*_+=-)',
      (val) => new RegExp(/^(?=.*[A-ZА-Я])(?=.*\d)(?=.*?[#?!@$%^&*_+=-]).*$/g).test(val!)
    )
    .test('regex', 'Пароль не може містити пробіли', (val) => {
      const result = new RegExp(/[\s]/g).test(val!);

      return !result;
    })
    .min(6, 'Пароль занадто короткий!')
    .required('Це поле не повинно бути пустим!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Пароль не співпадає')
    .required('Це поле не повинно бути пустим'),
});

export const ResetPasswordForm: FC = () => {
  const router = useRouter();
  const { code: codeQuery, userId } = router.query;

  const { user, setGlobalUser } = useContext(UserContext);
  const { allCategories } = useCategories();

  const [visible, setVisible] = useState(false);
  const [res, setRes] = useState<IResponseMessage>();
  const [loading, setLoading] = useState(true);
  const onShow = () => setVisible(true);

  useEffect(() => {
    setLoading(true);
    const data = {
      userId: +userId,
      token: codeQuery as string,
    };
    if (data.userId && data.token) {
      api.user.preResetPassword(data).then((res) => {
        setRes(res.data);
        setLoading(false);
      });
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { newPassword, confirmPassword } = values;
        const data = {
          userId: +userId,
          token: codeQuery as string,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        };
        const res = await api.user.resetPassword(data);
        if (res.data) {
          if (user) {
            const updatedUser = res.data;
            setUser(updatedUser);
            setGlobalUser(updatedUser);
          }
          onShow();
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (error) {}
    },
  });

  const metaData = {
    title: 'Анулювання паролю',
    description: 'Сторінка анулювання паролю',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <Header categories={allCategories!} />
      <div className={classes.container}>
        {loading ? (
          <Col sm="12" md={{ size: 6, offset: 3 }} className={'text-center'}>
            <Spinner color="info" />
          </Col>
        ) : !res?.success ? (
          <Alert color="warning" style={{ margin: '5%' }}>
            <h6 style={{ textAlign: 'center' }}>{res?.message}</h6>
          </Alert>
        ) : (
          <Form onSubmit={formik.handleSubmit} className={classes.container__resetPassworForm}>
            <Alert color="success" isOpen={visible}>
              <h6>Вітаємо! Пароль успішно встановлений!</h6>
            </Alert>
            <AppInput
              type="password"
              formik={formik}
              field="newPassword"
              label="Новий пароль"
              placeholder=""
            />
            <AppInput
              type="password"
              formik={formik}
              field="confirmPassword"
              label="Підтвердіть пароль"
              placeholder=""
            />
            <Button color="primary">Підтвердити</Button>
          </Form>
        )}
      </div>
      <Footer />
    </MainLayout>
  );
};

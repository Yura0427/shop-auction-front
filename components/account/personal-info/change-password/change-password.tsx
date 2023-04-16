import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Form, Popover, PopoverBody } from 'reactstrap';

import AppInput from 'components/inputs/app-input';
import styles from './change-password.module.scss';
import { api } from 'api';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, 'Пароль занадто короткий!')
    .required('Це поле не повинно бути пустим!'),
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
    .required('Це поле не повинно бути пустим!')
    .min(6, 'Пароль не може бути меншим за 6 символів'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Пароль не співпадає')
    .required('Це поле не повинно бути пустим'),
});

const ChangePassword: FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const togglePop = () => {
    setPopoverOpen(true);
    setTimeout((timeout) => {
      clearTimeout(timeout);
      setPopoverOpen(false);
    }, 5000);
  };
  const [visible, setVisible] = useState(false);
  const onShow = () => setVisible(true);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await api.user.changePassword(values);
        if (res.data) {
          resetForm();
          onShow();
        } else {
          togglePop();
        }
      } catch (error) {
        throw error.response.data;
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Alert color="success" isOpen={visible}>
        <h5>Пароль успішно змінено!</h5>
      </Alert>

      <div className={styles.control}>
        <AppInput
          type={'password'}
          formik={formik}
          field="currentPassword"
          label="Поточний пароль"
          placeholder=""
        />
      </div>

      <div className={styles.control}>
        <AppInput
          type={'password'}
          formik={formik}
          field="newPassword"
          label="Новий пароль"
          placeholder=""
        />
      </div>

      <div className={styles.control}>
        <AppInput
          type={'password'}
          formik={formik}
          field="confirmNewPassword"
          label="Новий пароль ще раз"
          placeholder=""
        />
      </div>
      <Popover placement="top" isOpen={popoverOpen} target="changePasswordPop">
        <PopoverBody>Ви ввели неправильний поточний пароль!</PopoverBody>
      </Popover>
      <Button id="changePasswordPop" type="submit" color="primary" className={styles['save-btn']}>
        Зберегти
      </Button>
    </Form>
  );
};

export default ChangePassword;

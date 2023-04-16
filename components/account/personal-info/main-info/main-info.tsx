import React, { FC, useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, Button, Form, Popover, PopoverBody } from 'reactstrap';
import { MdEdit } from 'react-icons/md';

import { IUpdateUser } from 'interfaces/account/update-user.interface';
import { api } from 'api';
import AppInput from 'components/inputs/app-input';
import PhoneInput from 'components/inputs/phone-input';
import DateInput from 'components/inputs/date-input';
import { formatDate } from 'utils/format-date';
import { UserContext } from '../../../context/user-context';
import styles from './main-info.module.scss';
import { IPopoverState } from 'interfaces/user/auth';
import { phoneNumberFormatter } from '../../../../utils/phone-number-formatter';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, "Введіть коректне ім'я")
    .required('Це поле не повинно бути пустим')
    .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, "Поле ім'я не може містити цифри та спецсимволи!"),
  lastName: Yup.string()
    .trim()
    .min(2, 'Введіть коректне прізвище')
    .required('Це поле не повинно бути пустим')
    .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, 'Поле прізвище не може містити цифри та спецсимволи!'),
  dataOfBirth: Yup.date(),
  phoneNumber: Yup.string()
    .test('length', 'Неправильний номер телефону', (value: string | null | undefined): boolean => {
      if (typeof value === 'string') {
        const lengthOnlyNumbers = value.replace(/-|_/g, '').length;
        return lengthOnlyNumbers === 17;
      }
      return false;
    })
    .required('Це поле не повинно бути пустим'),
});

const MainInfo: FC = () => {
  const { user, setGlobalUser } = useContext(UserContext);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [popoverState, setPopoverState] = useState<IPopoverState>({
    message: '',
    statusCode: 0,
  });

  const togglePop = () => {
    setPopoverOpen(!popoverOpen);
  };

  const [visible, setVisible] = useState(false);
  const onShow = () => {
    setVisible(true);
    setTimeout((timeout) => {
      clearTimeout(timeout);
      setVisible(false);
    }, 5000);
  };

  const formik = useFormik({
    initialValues: {
      lastName: user ? user.lastName : '',
      firstName: user ? user.firstName : '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : '',
      phoneNumber: user ? user.phoneNumber : '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { lastName, firstName, dateOfBirth, phoneNumber } = values;

      const updatedInfo: IUpdateUser = {};

      if (!user) return;

      if (lastName && lastName !== user.lastName) {
        updatedInfo.lastName = lastName;
      }
      if (firstName && firstName !== user.firstName) {
        updatedInfo.firstName = firstName;
      }
      if (dateOfBirth !== user.dateOfBirth) {
        updatedInfo.dateOfBirth = new Date(dateOfBirth);
      }
      if (phoneNumber && phoneNumber.slice(1).split(' ').join('') !== user.phoneNumber) {
        updatedInfo.phoneNumber = phoneNumber.slice(1).split(' ').join('');
      }

      if (Object.keys(updatedInfo).length) {
        try {
          const { data, error } = await api.user.updateUser(user.id, updatedInfo);

          if (error) {
            setPopoverState({ ...error });
            togglePop();
            setTimeout(() => {
              setPopoverOpen(false);
            }, 5000);
            return;
          }

          setGlobalUser(data);
          onShow();
          setEditMode(false);
        } catch (error: any) {
          throw error?.response?.data;
        }
      }
    },
  });

  return (
    <div className={styles.container}>
      <Alert color="success" isOpen={visible}>
        <h5>Дані успішно змінено!</h5>
      </Alert>
      {!editMode && (
        <span className={styles['edit-btn']} onClick={() => setEditMode(true)}>
          <MdEdit size={23} color="grey" />
        </span>
      )}

      {editMode ? (
        <Form onSubmit={formik.handleSubmit}>
          <AppInput formik={formik} field="lastName" label="Прізвище" />

          <AppInput formik={formik} field="firstName" label="Ім'я" />

          <DateInput formik={formik} field="dateOfBirth" label="Дата Народження" />

          <PhoneInput formik={formik} />

          <Popover placement="top" isOpen={popoverOpen} target="updateUser">
            <PopoverBody>{popoverState?.message}</PopoverBody>
          </Popover>

          <div className={styles['btn-wrapper']}>
            <Button id="updateUser" type="submit" color="primary" className={styles['save-btn']}>
              Зберегти
            </Button>
            <Button type="button" color="secondary" onClick={() => setEditMode(false)}>
              Скасувати
            </Button>
          </div>
        </Form>
      ) : (
        <div className={styles.content}>
          <p>
            <span>Прізвище</span>
            <span>{user ? user.lastName : ''}</span>
          </p>
          <p>
            <span>Ім'я</span>
            <span>{user ? user.firstName : ''}</span>
          </p>
          <p>
            <span>Дата Народження</span>
            <span>{user && user.dateOfBirth ? formatDate(new Date(user.dateOfBirth)) : ''}</span>
          </p>
          <p>
            <span className={user !== null && user.phoneNumber === null ? styles.hred : ''}>
              Номер телефону
            </span>
            <span>{user ? phoneNumberFormatter(user.phoneNumber) : ''}</span>
          </p>
          <p>
            <span>На вашому рахунку</span>
            <span>{user?.userWallet} грн.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MainInfo;

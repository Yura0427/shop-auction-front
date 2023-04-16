import React, { FC, useContext, useEffect, useState } from 'react';
import { Form, FormGroup, Input, FormFeedback, Alert, Popover, PopoverBody } from 'reactstrap';
import InputMask from 'react-input-mask';
import classes from './auth.module.scss';
import { IPopoverState } from '../../../interfaces/user/auth';
import ResendMessage from '@forms/auth/resend-message';
import { UserContext } from 'components/context/user-context';
import { LoginTab } from '../../../components/context/login-tab';
import { EAuthTabs } from '../../../interfaces/modal';

interface FastOrderRegisterFormProps {
  visible?: boolean;
  popoverState?: IPopoverState;
  popoverOpen?: boolean;
  formik: any;
}

export const FastOrderRegisterForm: FC<FastOrderRegisterFormProps> = ({
  formik,
  visible,
  popoverState,
  popoverOpen,
}) => {
  const { user } = useContext(UserContext);
  const { currentTab } = useContext(LoginTab);
  const [isShowButtonOrder, setIsShowButtonOrder] = useState(false);

  useEffect(() => {
    if (currentTab === EAuthTabs.fastOrder) {
      setIsShowButtonOrder(true);
    } else {
      setIsShowButtonOrder(false);
    }
  }, [currentTab]);

  return (
    <Form className={classes.form}>
      <Alert color="success" isOpen={visible}>
        <h5>Реєстрація пройшла успішно!</h5>
      </Alert>
      <FormGroup className={classes.formGroup}>
        <Input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Iм&#39;я"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!(formik.errors.firstName && formik.touched.firstName)}
          onKeyPress={(value) => {
            if ('1234567890'.indexOf(value.key) != -1) value.preventDefault();
          }}
        />
        <FormFeedback>{formik.errors.firstName}</FormFeedback>
      </FormGroup>
      <FormGroup className={classes.formGroup}>
        <Input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Прізвище"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!(formik.errors.lastName && formik.touched.lastName)}
          onKeyPress={(value) => {
            if ('1234567890'.indexOf(value.key) != -1) value.preventDefault();
          }}
        />
        <FormFeedback>{formik.errors.lastName}</FormFeedback>
      </FormGroup>
      <div className={classes.control}>
        <FormGroup className={classes.formGroup}>
          <InputMask
            style={{
              borderColor:
                formik.errors.phoneNumber && formik.touched.phoneNumber ? '#dc3545' : '#e2e6e7',
            }}
            type="tel"
            className={classes.input_mask}
            mask="+380\ 99 999 99 99"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="+380 __ ___ __ __"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className={classes.tel_icon}></span>
          {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
            <div className={classes.form__invalid}>{formik.errors.phoneNumber}</div>
          ) : null}
        </FormGroup>
      </div>
      {user && (
        <FormGroup className={classes.formcheckout}>
          <Input
            type="checkbox"
            name="notcall"
            className={classes.checkbox}
            value={formik.values.notcall}
            checked={formik.values.notcall}
            onChange={formik.handleChange}
          />
          Не передзвонювати
        </FormGroup>
      )}
      <div className={classes.control}>
        <FormGroup className={classes.formGroup}>
          <Input
            type="email"
            className={classes.input_mask}
            name="email"
            id="email-field"
            placeholder="Електронна пошта"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!(formik.errors.email && formik.touched.email)}
          />
          <span className={classes.email_icon}></span>
          <FormFeedback>{formik.errors.email}</FormFeedback>
        </FormGroup>
        <ResendMessage popoverState={popoverState} formik={formik} />
      </div>
      {isShowButtonOrder && (
        <Popover placement="top" isOpen={popoverOpen} target="fastOrderPop">
          <PopoverBody>{popoverState?.message}</PopoverBody>
        </Popover>
      )}
    </Form>
  );
};

import React, { useContext } from 'react';
import { Alert, Button, Form, FormGroup, Popover, PopoverBody, Row } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
// import FacebookLogin from 'react-facebook-login-typed';
import classes from './auth.module.scss';
import { register } from 'services/auth-requests';
import { IPopoverState, IRegister } from 'interfaces/user/auth';
// import { FacebookSvg } from '../../svgs/Facebook.svg';
import { setToken } from 'services/local-storage-controller';
import { api } from 'api';
import { UserContext } from '../../context/user-context';
import ResendMessage from '@forms/auth/resend-message';
import { useCartReplace } from '../../../hooks/cart/useCartReplacer';
import { UseProductsInCart } from '../../../hooks/cart/useProductsInCart';
import AppInput from '../../inputs/app-input';
import { useRouter } from 'next/router';
import { googleResponse } from './../../../interfaces/user/auth';
import jwtDecode from 'jwt-decode';
import { decodeDataI } from './../../../interfaces/user/auth';
import { EAuthTabs } from '../../../interfaces/modal';
import { LoginTab } from '../../../components/context/login-tab';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Введіть коректне ім'я!")
    .required('Це поле не повинно бути пустим!')
    .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, "Поле ім'я не може містити цифри та спецсимволи!"),
  lastName: Yup.string()
    .min(2, 'Введіть коректне прізвище!')
    .required('Це поле не повинно бути пустим!')
    .matches(/^[a-zA-ZА-Яа-яёЁЇїІіЄєҐґ ]+$/, 'Поле прізвище не може містити цифри та спецсимволи!'),
  phoneNumber: Yup.string()
    .test('length', 'Неправильний номер телефону', (value: string | null | undefined): boolean => {
      if (typeof value === 'string') {
        const lengthOnlyNumbers = value.replace(/-|_/g, '').length;
        return lengthOnlyNumbers === 17;
      }
      return false;
    })
    .required('Це поле не повинно бути пустим!'),
  email: Yup.string().email('Неправильна адреса!').required('Це поле не повинно бути пустим!'),
  password: Yup.string()
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
    .oneOf([Yup.ref('password')], 'Пароль не співпадає!')
    .required('Це поле не повинно бути пустим!'),
});

export const RegisterForm: React.FC<IRegister> = ({
  toggle,
  toggleConfirmed,
  returnToTabHandler,
}) => {
  const google = (window as any).google; // we download it in MainLayout.tsx <script src="https://accounts.google.com/gsi/client" async defer></script>
  const { setGlobalUser } = React.useContext(UserContext);
  const [visible, setVisible] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [popoverState, setPopoverState] = React.useState<IPopoverState>({
    message: '',
    statusCode: 0,
  });
  const router = useRouter();
  const { mutate, data: userOrder } = UseProductsInCart();
  const { setCurrentTab } = useContext(LoginTab);
  const onShow = () => setVisible(true);
  const togglePop = () => setPopoverOpen(!popoverOpen);
  const handleGoogleLogin = async ({ credential }: googleResponse) => {
    if (!credential) throw new Error('Problem on Client!');
    try {
      const { email, family_name, given_name, sub }: decodeDataI = jwtDecode(credential);
      const wrapper = {
        email,
        familyName: family_name,
        givenName: given_name,
        googleId: sub,
      };
      const { data } = await api.user.googleSignIn(wrapper);
      const { token, user } = data;
      setGlobalUser(user);
      setToken(token);
      if (!user.phoneNumber) router.push('/account/personal-information');
      toggle && toggle();
      returnToTabHandler();
    } catch (error) {
      togglePop();
      throw new Error("Can't google login :(");
    }
  };

  React.useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
    google.accounts.id.renderButton(document.getElementById('google-login'), {
      type: 'standart',
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      width: 270,
      locale: 'uk_UA',
    });
    google.accounts.id.prompt();
  }, []);

  // const responseFacebook = async (response: any) => {
  //   if (response.accessToken) {
  //     try {
  //       const res = await api.user.fbSignIn(response);
  //       const { token, user } = res.data;
  //       setUser(user);
  //       setGlobalUser(user);
  //       setToken(token);
  //       toggle();
  //     } catch (error) {
  //       togglePop();
  //       throw error.response.data;
  //     }
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      const { data, error } = await register(values);

      if (error) {
        setPopoverState({ ...error });
        togglePop();
        setTimeout(() => {
          setPopoverOpen(false);
        }, 5000);
        return;
      }

      const { token, user } = data;
      setGlobalUser(user);
      if (user) setCurrentTab(EAuthTabs.fastOrder);
      setToken(token);
      onShow();
      resetForm();
      toggle && toggle();
      toggleConfirmed && toggleConfirmed();
      returnToTabHandler();
      await useCartReplace(mutate, userOrder!);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} name="registerForm" className={classes.form}>
      <Alert color="success" isOpen={visible}>
        <h5>Реєстрація пройшла успішно!</h5>
      </Alert>
      <AppInput field={'firstName'} formik={formik} type={'text'} placeholder={"Iм'я"} />
      <AppInput field={'lastName'} formik={formik} type={'text'} placeholder={'Прізвище'} />
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
      <div className={classes.control}>
        <AppInput
          field={'email'}
          formik={formik}
          type={'email'}
          placeholder={'Електронна пошта'}
          customClass={classes.input_mask}
        >
          <span className={classes.email_icon} />
        </AppInput>
      </div>
      <div className={classes.control}>
        <AppInput
          field={'password'}
          formik={formik}
          type={'password'}
          placeholder={'Введіть пароль'}
          customClass={classes.input_mask}
        >
          <span className={classes.password_icon} />
        </AppInput>
      </div>
      <div className={classes.control}>
        <AppInput
          field={'confirmPassword'}
          formik={formik}
          type={'password'}
          placeholder={'Підтвердіть пароль'}
          customClass={classes.input_mask}
        >
          <span className={classes.password_icon} />
        </AppInput>
      </div>
      <Popover placement="top" isOpen={popoverOpen} target="loginPop">
        <PopoverBody>{popoverState?.message}</PopoverBody>
      </Popover>
      <Button id="loginPop" className={classes.form__register} type="submit">
        Зареєструватися
      </Button>
      <ResendMessage popoverState={popoverState} formik={formik} />
      <Row className={classes.form__socialBtn}>
        {/* <FacebookLogin
          appId={process.env.NEXT_PUBLIC_REACT_APP_FACEBOOK_APP_ID!}
          autoLoad={false}
          callback={responseFacebook}
          fields="name,email,picture"
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              className={`${classes.form__social} ${classes['fb-btn']}`}
              outline
              color="primary"
            >
              <FacebookSvg color="#007bff" />
              Facebook
            </Button>
          )}
        /> */}
        <div id="google-login"></div>
      </Row>
    </Form>
  );
};

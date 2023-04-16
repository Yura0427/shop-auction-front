import React, { useContext } from 'react';
import { Button, Col, Form, Popover, PopoverBody, Row } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import FacebookLogin from 'react-facebook-login-typed';
import classes from './auth.module.scss';
import { login } from 'services/auth-requests';
import { IAuth, IPopoverState } from 'interfaces/user/auth';
import { setToken, setUser } from 'services/local-storage-controller';
import { api } from 'api';
// import { FacebookSvg } from '../../svgs/Facebook.svg';
import { UserContext } from '../../context/user-context';
import ResendMessage from '@forms/auth/resend-message';
import Route from '../../route/Route';
import { useCartReplace } from '../../../hooks/cart/useCartReplacer';
import { UseProductsInCart } from '../../../hooks/cart/useProductsInCart';
import AppInput from '../../inputs/app-input';
import { googleResponse } from './../../../interfaces/user/auth';
import jwtDecode from 'jwt-decode';
import { decodeDataI } from './../../../interfaces/user/auth';
import { LoginTab } from '../../../components/context/login-tab';
import { EAuthTabs } from '../../../interfaces/modal';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Неправильна адреса!').required('Це поле не повинно бути пустим!'),
  password: Yup.string()
    .min(6, 'Пароль занадто короткий!')
    .required('Це поле не повинно бути пустим!'),
});

export const LoginForm: React.FC<IAuth> = ({ returnToTabHandler, toggle }) => {
  const google = (window as any).google; // we download it in MainLayout.tsx <script src="https://accounts.google.com/gsi/client" async defer></script>
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [popoverState, setPopoverState] = React.useState<IPopoverState>({
    message: '',
    statusCode: 0,
  });
  const { setGlobalUser } = React.useContext(UserContext);
  const { mutate, data: userOrder } = UseProductsInCart();
  const { setCurrentTab } = useContext(LoginTab);
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
      setUser(user);
      setGlobalUser(user);
      setToken(token);
      toggle && toggle();
      await useCartReplace(mutate, userOrder!);
      await mutate();
    } catch (error) {
      togglePop();
      throw new Error("Can't google login :(");
    }
  };

  React.useEffect(() => {
    if (google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
      google.accounts.id.renderButton(document.getElementById('google-login'), {
        type: 'standart',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 270,
        locale: 'uk_UA',
      });
      google.accounts.id.prompt();
    }
  }, [google]);

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
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      const { data, error } = await login(values);

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
      resetForm();
      toggle && toggle();
      returnToTabHandler();
      await useCartReplace(mutate, userOrder!);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} className={classes.form}>
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
      <Popover placement="bottom" isOpen={popoverOpen} target="loginPop">
        <PopoverBody>{popoverState?.message}</PopoverBody>
      </Popover>
      {/* <Label className={classes.form__rememberMe}>
        <Input type="checkbox" name="rememberMe" />
        Запам'ятати мене
      </Label> */}
      <Button id="loginPop" className={classes.form__login} type="submit">
        Увійти
      </Button>
      <Button onClick={returnToTabHandler} className={classes.form__register} type="button">
        Зареєструватися
      </Button>
      <ResendMessage popoverState={popoverState} formik={formik} />
      <Col>
        <Row className={classes.form__resetPassword}>
          <Route href="/password/forgot">
            <span>Забули пароль?</span>
          </Route>
        </Row>
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
      </Col>
    </Form>
  );
};

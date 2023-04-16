import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Button, Input, FormFeedback, FormGroup, Alert } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IoMdClose } from 'react-icons/io';

import { IModalProps } from 'interfaces/modal';
import styles from './ContactUs.module.scss';
import { api } from '../../../api';
import { IPopoverState } from '../../../interfaces/user/auth';
import { CompanyInformation } from 'constants/company-information';
import {TelegramSvg, PhoneSvg, MailSvg} from './svgs';

const validationSchema = Yup.object({
  text: Yup.string().required(`Це поле не повинно бути пустим!`),
  email: Yup.string()
    .email(`Електронна пошта некоректна`)
    .required(`Це поле не повинно бути пустим!`),
  name: Yup.string().min(3, `Ім'я занадто коротке`).required(`Це поле не повинно бути пустим!`),
});

export const ContactUs: FC<IModalProps> = ({ toggle, isOpen }) => {
  const [responseMessage, setResponseMessage] = useState<IPopoverState>({
    message: '',
    statusCode: 0,
  });
  const [dispatchStatus, setDispatchStatus] = useState(false);
  const [visibleResponse, setVisibleResponse] = useState(false);

  useEffect(() => {
    setVisibleResponse(true);
    setTimeout(() => {
      setVisibleResponse(false);
    }, 2000);
  }, [dispatchStatus]);

  const formik = useFormik({
    initialValues: { text: '', email: '', name: '' },
    validationSchema,
    onSubmit: async (values) => {
      const { text, email, name } = values;
      const res = await api.user.feedbackUser({ text, email, name });
      const { error, data } = res;
      if (error) {
        setResponseMessage({ ...error });
        setDispatchStatus(false);
      } else {
        setResponseMessage({ message: data.message });
        setDispatchStatus(true);
      }
    },
  });

  return (
    <Modal
      centered
      isOpen={isOpen}
      toggle={toggle}
      modalClassName={styles.fade}
      className={styles.modal}
      contentClassName={styles.content}
    >
      <Form className={styles.form} onSubmit={formik.handleSubmit}>
        <Button className={styles.close} onClick={toggle}>
          <IoMdClose size={25} color={styles.fontColor} />
        </Button>
        <h1>Зв'язатися з нами</h1>

        {visibleResponse ? (
          <Alert
            color={dispatchStatus ? 'success' : 'danger'}
            isOpen={true}
            className={styles.statusSendFeedback}
          >
            <h6>{responseMessage.message}</h6>
          </Alert>
        ) : null}

        <FormGroup className={styles.formgroup1}>
          <Input
            type="textarea"
            name="text"
            className={styles.textfield}
            placeholder="Залишіть повідомлення"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!(formik.touched.text && formik.errors.text)}
          />
          <FormFeedback className={styles.errorline}>{formik.errors.text}</FormFeedback>
        </FormGroup>

        <FormGroup className={styles.formgroup2}>
          <Input
            type="email"
            name="email"
            placeholder="Електронна пошта"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!(formik.touched.email && formik.errors.email)}
          />
          <FormFeedback className={styles.errorline}>{formik.errors.email}</FormFeedback>
        </FormGroup>

        <FormGroup className={styles.formgroup3}>
          <Input
            type="text"
            name="name"
            placeholder="Повне ім'я"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!(formik.touched.name && formik.errors.name)}
          />
          <FormFeedback className={styles.errorline}>{formik.errors.name}</FormFeedback>
        </FormGroup>

        <Button type="submit">Надіслати</Button>
        <ul>
          <li data-name="phone">
            <PhoneSvg />
            <a href={`tel:${CompanyInformation.PHONE_NUMBER_1}`}>
              {CompanyInformation.PHONE_NUMBER_1}
            </a>
          </li>
          <li data-name="email">
            <MailSvg />
            <a href={'mailto::buyallforclients@waf.com.ua'}>buyallforclients@waf.com.ua</a>
          </li>
          <li data-name="telegram">
            <TelegramSvg />
            <a href={'https://t.me/buyallclients'} target='_blank' >@buyallclients</a>
          </li>
        </ul>
      </Form>
    </Modal>
  );
};

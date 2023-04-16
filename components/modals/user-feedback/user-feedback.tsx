import React, { FC, useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { api } from '../../../api';

import { UserContext } from '../../context/user-context';
import { SnackBarContext } from '../../context/snackBar-context';
import { UtilsContext } from '../../context/utils-context';
import { setFeedbackClick, getFeedbackClick } from '../../../services/local-storage-controller';

import { Form, FormikProvider, useFormik } from 'formik';
import { Collapse, Button, CardBody, Card, Input } from 'reactstrap';
import { RiFeedbackLine } from 'react-icons/ri';
import { VscChromeClose } from 'react-icons/vsc';
import styles from './user-feedback.module.scss';
import classnames from 'classnames';
import { IAddFeedback } from '../../../interfaces/feedback/feedback';

const UserFeedback: FC<{ setMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setMenuOpen,
}) => {
  const { user } = useContext(UserContext);
  const { feedbackVisible, feedbackOpen, setFeedbackOpen } = useContext(UtilsContext);
  const { showSnackBar } = useContext(SnackBarContext);

  const toggle = () => {
    const clickTime = getFeedbackClick();

    if (!clickTime) {
      setFeedbackClick();
    }
    setFeedbackOpen(!feedbackOpen);
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: Yup.object().shape({
      text: Yup.string().trim().required('Це поле не повинно бути пустим'),
    }),
    onSubmit: async (values) => {
      let valuesToSend: IAddFeedback = { ...values };

      if (user) {
        valuesToSend = { ...valuesToSend, userId: user.id };
      }

      const { error } = await api.feedbacks.addFeedback(valuesToSend);
      const message = `Ваш відгук був надісланий. Дякуюємо за підтримку!`;

      if (error) {
        showSnackBar(error.message, false);
        return;
      }

      showSnackBar(message, true);
      formik.resetForm();

      setFeedbackOpen(false);
    },
  });

  useEffect(() => {
    setTimeout(() => {
      const clickTime = getFeedbackClick();

      if (!clickTime) {
        setMenuOpen(true);
        setFeedbackOpen(true);
      }
    }, 25000);
  }, []);

  return (
    <>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          {feedbackVisible ? (
            <div className={styles.container}>
              <span
                onClick={toggle}
                className={classnames(styles.container_windowBtn, {
                  [styles.active]: feedbackOpen,
                })}
              >
                <RiFeedbackLine />
              </span>
              <Collapse isOpen={feedbackOpen}>
                <Card className={styles.container_card}>
                  <CardBody className={styles.container_card_body}>
                    <span onClick={toggle} className={styles.container_card_body_cross}>
                      <VscChromeClose />
                    </span>
                    <p>Відгук користувача</p>
                    <span>
                      Для нас головне, щоб кожен Клієнт був задоволеним, тому в першу чергу
                      звертаємо увагу на Ваші побажання. Ви можете залишити їх тут.
                    </span>
                    <Input
                      type="textarea"
                      name="text"
                      formik={formik}
                      value={formik.values.text}
                      onChange={formik.handleChange}
                      invalid={!!(formik.touched.text && formik.errors.text)}
                      className={styles.container_card_body_input}
                      placeholder="Введіть текст тут..."
                    />
                    <div className={styles.container_card_body_btn}>
                      <Button type="submit" color="success">
                        Надіслати відгук
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Collapse>
            </div>
          ) : null}
        </Form>
      </FormikProvider>
    </>
  );
};

export default UserFeedback;

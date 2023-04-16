import React, {FC} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from 'yup';
import { Button, Input } from 'reactstrap';

import { IReviewForm } from 'interfaces/comment/comment';
import styles from './review-form.module.scss';

const lengthError = "Кількість символів не має перевищувати 500";

const validationSchema = Yup.object({
  text: Yup.string()
    .trim().required(`Це поле не повинно бути пустим!`)
    .max(500, lengthError)
});

const ReviewForm: FC<IReviewForm> = ({
  editMode,
  cancelEditMode = () => {},
  mainForm = false,
  initialText = '',
  setCommentToUpdate,
  getFormValue,
}) => {
  const formik = useFormik({
    initialValues: { text: initialText },
    validationSchema,
    validateOnBlur: false,
    onSubmit: (values) => {
      getFormValue(values.text.trim());
      formik.resetForm();
      setCommentToUpdate && setCommentToUpdate(null);
      cancelEditMode();
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          className={editMode || mainForm ? styles.form : styles['hide-form']}
          onSubmit={formik.handleSubmit}
        >
          {!editMode ? <h5>Написати відгук</h5> : null}
          <Input
            type="textarea"
            name="text"
            value={formik.values.text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={!!(formik.touched.text && formik.errors.text)}
          />
          <div style={{ display: formik.errors.text === lengthError ? "none" : "block" }} className={styles.form__invalid}>{formik.errors.text}</div>
          <span 
            style={{ color: formik.errors.text === lengthError ? "red" : "grey" , fontSize: "12px"}}>
            * Кількість символів не має перевищувати 500
          </span>
          <div className={styles['btn-group']}>
            <Button type="submit">{editMode ? 'Зберегти' : 'Надіслати'}</Button>
            {editMode ? (
              <Button type="button" onClick={cancelEditMode}>
                Скасувати
              </Button>
            ) : null}
          </div>
        </Form>
      </FormikProvider>
    </>
  );
};

export default ReviewForm;

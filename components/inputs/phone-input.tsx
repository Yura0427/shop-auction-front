import React, { FC } from 'react';
import { FormikContextType } from 'formik';
import { FormGroup, Input, Label } from 'reactstrap';
import InputMask from 'react-input-mask';

import styles from './input.module.scss';

interface PhoneInputProps {
  formik: FormikContextType<any>;
}

const PhoneInput: FC<PhoneInputProps> = ({ formik }) => {
  return (
    <FormGroup className={styles['phone-input']}>
      <Label className={styles.label}>Номер телефону</Label>
      <Input
        style={{
          borderColor:
            formik.errors.phoneNumber && formik.touched.phoneNumber ? '#dc3545' : '#e2e6e7',
        }}
        type="tel"
        mask="+380\ 99 999 99 99"
        name="phoneNumber"
        id="phoneNumber"
        placeholder="+380 __ ___ __ __"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        tag={InputMask}
      />
      {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
        <div className={styles['error-msg']}>{formik.errors.phoneNumber}</div>
      ) : null}
    </FormGroup>
  );
};

export default PhoneInput;

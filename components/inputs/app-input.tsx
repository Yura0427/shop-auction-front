import React, { FC, ReactNode, useState } from 'react';
import { FormikContextType } from 'formik';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';

import styles from './input.module.scss';
import PasswordEyeIcon from '../buttons/password-eye-btn';

interface InputProps {
  formik: FormikContextType<any>;
  field: string;
  label?: string;
  type?: InputType;
  placeholder?: string;
  customClass?: string;
  children?: ReactNode;
}

const AppInput: FC<InputProps> = ({
  formik,
  field,
  label,
  type = 'text',
  placeholder = label,
  customClass,
  children,
}) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassHandler = () => {
    setPasswordShown((prev) => !prev);
  };

  const customType = type === 'password' ? (passwordShown ? 'text' : 'password') : type;

  return (
    <FormGroup className={styles.group}>
      {label && (
        <Label for={field} className={styles.label}>
          {label}
        </Label>
      )}
      <Input
        className={customClass}
        name={field}
        value={formik.values[field]}
        id={field}
        type={customType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        invalid={!!(formik.errors[field] && formik.touched[field])}
        placeholder={placeholder}
      />
      {formik.errors[field] && formik.touched[field] && (
        <FormFeedback>{formik.errors[field]}</FormFeedback>
      )}
      {children}
      {type === 'password' && (
        <PasswordEyeIcon
          customClass={!!(formik.errors[field] && formik.touched[field])}
          onClick={togglePassHandler}
          passwordShown={passwordShown}
        />
      )}
    </FormGroup>
  );
};

export default AppInput;

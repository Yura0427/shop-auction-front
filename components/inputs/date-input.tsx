import React from 'react';
import { FormikContextType } from 'formik';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { InputType } from 'reactstrap/es/Input';

import { formatDate } from 'utils/format-date';
import styles from './input.module.scss';

interface InputProps {
  formik: FormikContextType<any>;
  field: string;
  label: string;
  type?: InputType;
  placeholder?: string;
}

const DateInput = ({ formik, field, label, placeholder = label }: InputProps) => {
  return (
    <FormGroup>
      <Label for={field} className={styles.label}>
        {label}
      </Label>
      <Input
        name={field}
        value={formatDate(formik.values[field])}
        id={field}
        type="date"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        invalid={!!(formik.errors[field] && formik.touched[field])}
        placeholder={placeholder}
        max={formatDate()}
      />
      {formik.errors[field] && formik.touched[field] && (
        <FormFeedback>{formik.errors[field]}</FormFeedback>
      )}
    </FormGroup>
  );
};

export default DateInput;

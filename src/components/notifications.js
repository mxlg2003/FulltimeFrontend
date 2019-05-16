import React from 'react';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
});

const initialValues = {
  firstName: 'Tony',
  lastName: 'Stark',
  email: 'ironman@avengers.io',
};

export default function Formal() {
  const formal = useFormal(initialValues, {
    schema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form {...formal.getFormProps()}>
      <input {...formal.getFieldProps('firstName')} type="text" />
      <input {...formal.getFieldProps('lastName')} type="text" />
      <input {...formal.getFieldProps('email')} type="text" />
      <button {...formal.getResetButtonProps()}>Reset</button>
      <button {...formal.getSubmitButtonProps()}>Submit</button>
    </form>
  );
}

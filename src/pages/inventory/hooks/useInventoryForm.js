import { useState } from 'react';

const useInventoryForm = ({
  initialValues,
  validate,
  onValidSubmit,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    onValidSubmit(values);
  };

  return {
    values,
    errors,
    setValues,
    setErrors,
    handleChange,
    handleSubmit,
  };
};

export default useInventoryForm;

import { TextField, TextFieldVariants } from '@mui/material';
import React, { FC, useMemo } from 'react';

import { getInputMaxLength } from 'src/components/UI/common/common';
import { StateFormInputOptionsType, StateFormReturnType } from 'src/utils/stateForm';
import { useInputBaseHook } from 'src/utils/stateForm/hooks/inputs';

type Props = {
  formProps: StateFormReturnType;
  name: string;

  type?: 'email' | 'text' | 'password' | 'textarea' | 'number';
  required?: boolean;
  label?: string;
  autoFocus?: boolean;
  maxLength?: number;
  errorLabel?: string;
  variant?: TextFieldVariants;
};

export const UiInput: FC<Props> = ({
  formProps: { onChange, register, unregister, getSubscribeProps },
  name,
  required,
  autoFocus,
  label,
  maxLength,
  type = 'text',
  errorLabel,
  variant,
}) => {
  const localMaxLength = useMemo(() => getInputMaxLength(maxLength), [maxLength]);

  const inputOptions = useMemo(
    (): StateFormInputOptionsType => ({
      required,
      maxLength: localMaxLength,
      errorLabel,
    }),
    [localMaxLength, required, errorLabel],
  );

  const [value, errors] = useInputBaseHook<string | number | null | undefined>({
    getSubscribeProps,
    name,
    inputOptions,
    unregister,
    register,
    type,
  });
  const hasErrors = !!errors?.length;

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      label={label}
      name={name}
      value={value}
      error={hasErrors}
      type={type}
      onChange={(e) => {
        onChange(name, e.target.value);
      }}
      variant={variant}
      helperText={hasErrors ? errorLabel : undefined}
      autoFocus={autoFocus}
    />
  );
};

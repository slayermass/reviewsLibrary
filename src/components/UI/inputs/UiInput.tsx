import { FormControl, Input, InputLabel, TextFieldVariants } from '@mui/material';
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
  endAdornment?: React.ReactNode;
  onChange?: (value: string) => void;
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
  endAdornment,
  onChange: onChangeProp,
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

  // <TextField expanded to custom
  return (
    <FormControl variant={variant} required={required} error={hasErrors} margin="normal" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Input
        type={type}
        onChange={(e) => {
          onChange(name, e.target.value);

          onChangeProp?.(e.target.value);
        }}
        value={value}
        autoFocus={autoFocus}
        endAdornment={endAdornment}
      />
    </FormControl>
  );
};

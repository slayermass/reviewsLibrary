import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { FC, useMemo } from 'react';

import { StateFormInputOptionsType, StateFormReturnType } from 'src/utils/stateForm';
import { useInputBaseHook } from 'src/utils/stateForm/hooks/inputs';

export type SelectOptionType = {
  label: string;
  value: string | number;
};

export type SelectOptionsType = SelectOptionType[];

type Props = {
  formProps: StateFormReturnType;
  name: string;
  options: SelectOptionsType;

  required?: boolean;
  label?: string;
  onChange?: (value: SelectOptionType['value'] | null) => void;
};

export const UiSelect: FC<Props> = ({
  formProps: { onChange, register, unregister, getSubscribeProps },
  name,
  required,
  label,
  onChange: onChangeProp,
  options,
}) => {
  const inputOptions = useMemo(
    (): StateFormInputOptionsType => ({
      required,
    }),
    [required],
  );

  const [value, errors] = useInputBaseHook<string | number | null | undefined>({
    getSubscribeProps,
    name,
    inputOptions,
    unregister,
    register,
    type: 'dropdown',
  });
  const hasErrors = !!errors?.length;

  return (
    <FormControl variant="standard" required={required} error={hasErrors} margin="normal" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => {
          onChange(name, e.target.value);

          onChangeProp?.(e.target.value);
        }}
        label={label}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

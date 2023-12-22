import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

import { UiInput } from 'src/components/UI/inputs/UiInput';
import { useStateForm } from 'src/utils/stateForm';

type Props = {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
};

type FormValues = {
  email: string;
  password: string;
};

export const LoginForm = ({ onLogin, loading }: Props): React.ReactElement => {
  const formProps = useStateForm<FormValues>();

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        <Box
          component="form"
          onSubmit={formProps.onSubmit((formData) => {
            onLogin(formData.email, formData.password);
          })}
          noValidate
          sx={{ mt: 1 }}
        >
          <UiInput formProps={formProps} name="email" label="Email" type="email" autoFocus required />
          <UiInput formProps={formProps} name="password" label="Пароль" type="password" required />
          <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }} loading={loading}>
            <span>Войти</span>
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

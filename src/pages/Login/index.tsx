import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoginForm } from 'src/pages/Login/component';
import useGlobalStore from 'src/store';
import { API } from 'src/utils/apiDriver';

export const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const setUser = useGlobalStore((state) => state.setUser);

  const onLogin = useCallback(
    (email: string, password: string) => {
      setLoading(true);

      API.login(email, password)
        .then(() => {
          setUser({ loading: false, response: { email } });
          navigate('/');
        })
        .catch(() => {
          toast.error(`Ошибка авторизации: пользователь не найден или не существует`);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [navigate, setUser],
  );

  return <LoginForm onLogin={onLogin} loading={loading} />;
};

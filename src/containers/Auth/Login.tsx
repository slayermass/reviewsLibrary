import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { LoginForm } from "components/Auth/LoginForm";
import { API } from "utils/apiDriver";
import { GlobalContext } from 'components/Auth/CheckRoute';


let mount = false;

export const LoginPage = (): React.ReactElement => {
  useEffect(() => {
    mount = true;
    return () => {
      mount = false;
    };
  }, []);

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const { setUserEmail } = useContext(GlobalContext);

  const onLogin = (email: string, password: string) => {
    setLoading(true);

    API.login(email, password)
      .then(() => {
        history.push("/");
        setUserEmail(email)
      })
      .catch(() => {
        toast.error(
          `Ошибка авторизации: пользователь не найден или не существует`
        );
      })
      .finally(() => {
        if (mount) {
          setLoading(false);
        }
      });
  };

  return <LoginForm onLogin={onLogin} loading={loading} />;
};

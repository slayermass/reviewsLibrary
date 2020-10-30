import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { LoginForm } from "components/Auth/LoginForm";
import { login } from "utils/firebase";

export const LoginPage = (): React.ReactElement => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const onLogin = (email: string, password: string) => {
    setLoading(true);

    login(email, password)
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        toast.error(`Ошибка авторизации: "${err.name}"`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return <LoginForm onLogin={onLogin} loading={loading} />;
};

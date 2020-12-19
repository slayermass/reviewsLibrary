import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { LoginForm } from "components/Auth/LoginForm";
import { API } from "utils/apiDriver";

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

  const onLogin = (email: string, password: string) => {
    setLoading(true);

    API.login(email, password)
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err.message);
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

  // const onAnonimLogin = useCallback(() => {
  //   setLoading(true);
  //
  //   loginAnonymously()
  //     .then(() => {
  //       history.push("/");
  //     })
  //     .catch((err) => {
  //       // eslint-disable-next-line no-console
  //       console.error(err.message);
  //       toast.error(`Ошибка анонимной авторизации`);
  //     })
  //     .finally(() => {
  //       if (mount) {
  //         setLoading(false);
  //       }
  //     });
  // }, []);

  return <LoginForm onLogin={onLogin} loading={loading} />;
};

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserType } from 'src/models/User';
import { PrivateRoutes } from 'src/routes/private';
import { PublicRoutes, ROUTE_LOGIN_PAGE } from 'src/routes/public';
import useGlobalStore from 'src/store';
import { API } from 'src/utils/apiDriver';
import { UiGlobalLoader } from 'src/components/UI/Loaders';

const CheckUser = () => {
  const navigate = useNavigate();

  const { setUser, user } = useGlobalStore((state) => state);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    API.checkAuth()
      .then((response: UserType) => {
        setUser({ loading: false, response });
      })
      .catch((e) => {
        setUser({ loading: false, response: null });

        navigate(ROUTE_LOGIN_PAGE);
      });
  }, [navigate, setUser]);

  return <UiGlobalLoader />;
};

export const App = (): React.ReactElement => {
  const user = useGlobalStore((state) => state.user);

  return (
    <>
      {user.loading && <CheckUser />}

      <PublicRoutes />

      {user.response !== null && <PrivateRoutes />}
    </>
  );
};

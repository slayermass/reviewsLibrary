import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { LoginPage } from "containers/Auth/Login";
import { UiGlobalLoader } from "components/UI/Loaders";
import { InnerRoutes } from "components/InnerRoutes";
import { API } from "utils/apiDriver";

export const reviewListPath = "/";
export const reviewFormPath = "/review-form";

export const GlobalContext = React.createContext<{
  isAnonymousUser: boolean;
  userEmail: string | null; // string всегда, иначе зайти не получится
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}>({
  isAnonymousUser: true,
  userEmail: null,
  setUserEmail: () => null
});

export const CheckRoute = (): React.ReactElement => {
  const history = useHistory();
  const [loadUser, setLoadUser] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAnonymousUser] = useState(false);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    API.checkAuth()
      .then((response) => {
        setUserEmail(response.email);
        setLoadUser(false);
      })
      .catch(() => {
        setLoadUser(false);
      });
  }, [history]);

  useEffect(() => {
    const {pathname} = history.location;

    /** защита роутов от неавторизованных */
    if (!loadUser && userEmail === null && pathname !== "/login") {
      history.push("/login");
    }

    /** защита роутов от анонимов */
    if (
      !loadUser &&
      [reviewFormPath].find(
        (path) => isAnonymousUser && pathname.includes(path)
      )
    ) {
      history.push("/");
    }
  }, [history, isAnonymousUser, loadUser]);

  if (loadUser) {
    return <UiGlobalLoader />;
  }
  return (
    <Switch>
      <GlobalContext.Provider value={{isAnonymousUser, userEmail, setUserEmail}}>

        <Route path="/login">
          <LoginPage />
        </Route>

        <InnerRoutes isAuth={userEmail !== null} />
      </GlobalContext.Provider>
    </Switch>
  );
};

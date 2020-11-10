import app from "firebase";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { LoginPage } from "containers/Auth/Login";
import { UiGlobalLoader } from "components/UI/Loaders";
import { InnerRoutes } from "components/InnerRoutes";

export const reviewListPath = "/";
export const reviewFormPath = "/review-form";

export const GlobalContext = React.createContext<{
  isAnonymousUser: boolean;
  userEmail: string | null; // string всегда, иначе зайти не получится
}>({
  isAnonymousUser: true,
  userEmail: null,
});

export const CheckRoute = (): React.ReactElement => {
  const history = useHistory();
  const [loadUser, setLoadUser] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAnonymousUser, setIsAnonymousUser] = useState(true);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);

        if (!user.isAnonymous) {
          setIsAnonymousUser(false);
        }
      }

      setLoadUser(false);
    });
  }, [history]);

  useEffect(() => {
    const { pathname } = history.location;

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
      <Route path="/login">
        <LoginPage />
      </Route>

      <GlobalContext.Provider value={{ isAnonymousUser, userEmail }}>
        <InnerRoutes isAuth={userEmail !== null} />
      </GlobalContext.Provider>
    </Switch>
  );
};

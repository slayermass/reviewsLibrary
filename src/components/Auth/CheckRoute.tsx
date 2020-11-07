import app from "firebase";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { LoginPage } from "containers/Auth/Login";
import { ReviewsList } from "containers/Reviews/List";
import { UiGlobalLoader } from "components/UI/Loaders";
import { ReviewsForm } from "containers/Reviews/Form";

export const reviewListPath = "/";
export const reviewFormPath = "/review-form";

export const GlobalContext = React.createContext<{ isAnonymousUser: boolean }>({
  isAnonymousUser: true,
});

export const CheckRoute = (): React.ReactElement => {
  const history = useHistory();
  const [loadUser, setLoadUser] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isAnonymousUser, setIsAnonymousUser] = useState(true);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsAuth(true);

        if (!user.isAnonymous) {
          setIsAnonymousUser(false);
        }
      }

      setLoadUser(false);

      if (!user) {
        history.push("/login");
      }
    });
  }, [history]);

  if (loadUser) {
    return <UiGlobalLoader />;
  }
  return (
    <Switch>
      {isAuth && (
        <GlobalContext.Provider value={{ isAnonymousUser }}>
          <Route path={reviewListPath} exact>
            <ReviewsList />
          </Route>
          <Route path={[`${reviewFormPath}/:id`, reviewFormPath]} exact>
            <ReviewsForm />
          </Route>
        </GlobalContext.Provider>
      )}

      <Route path="/login">
        <LoginPage />
      </Route>
    </Switch>
  );
};

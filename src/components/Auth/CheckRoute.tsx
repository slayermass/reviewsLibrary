import app from "firebase";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { LoginPage } from "containers/Auth/Login";
import { ReviewsList } from "containers/Reviews/List";
import { UiGlobalLoader } from "components/UI/Loaders";

export const CheckRoute = (): React.ReactElement => {
  const history = useHistory();
  const [loadUser, setLoadUser] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user.isAnonymous", user.isAnonymous);
        setIsAuth(true);
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
        <Route path="/" exact>
          <ReviewsList />
        </Route>
      )}

      <Route path="/login">
        <LoginPage />
      </Route>
    </Switch>
  );
};

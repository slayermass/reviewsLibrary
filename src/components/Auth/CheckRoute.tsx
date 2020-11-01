import app from "firebase";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import { LoginPage } from "containers/Auth/Login";
import { ReviewsList } from "containers/Reviews/List";
import { UiGlobalLoader } from "components/UI/GlobalLoader";

export const CheckRoute = (): React.ReactElement => {
  const history = useHistory();
  const [loadUser, setLoadUser] = useState(true);

  /** проверить авторизованность пользователя */
  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged");
      if (user) {
        console.log("user.isAnonymous", user.isAnonymous);
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
      <Route path="/" exact>
        <ReviewsList />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
    </Switch>
  );
};

import React from "react";
import { Redirect, Route } from "react-router-dom";

import { reviewFormPath, reviewListPath } from "components/Auth/CheckRoute";
import { ReviewsForm } from "containers/Reviews/Form";
import { ReviewsList } from "containers/Reviews/List";

type Props = {
  isAuth: boolean;
};

export const InnerRoutes = ({ isAuth }: Props): React.ReactElement =>
  isAuth ? (
    <>
      <Route path={reviewListPath} exact>
        <ReviewsList />
      </Route>
      <Route path={[`${reviewFormPath}/:id`, reviewFormPath]} exact>
        <ReviewsForm />
      </Route>
    </>
  ) : (
    <Redirect to="/" />
  );

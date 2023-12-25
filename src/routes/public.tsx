import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoginPage } from 'src/pages/Login';

export const ROUTE_LOGIN_PAGE = '/login';

export const PublicRoutes: FC = () => (
  <Routes>
    <Route path={ROUTE_LOGIN_PAGE} element={<LoginPage />} />
  </Routes>
);

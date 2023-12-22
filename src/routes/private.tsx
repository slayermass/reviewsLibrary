import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ReviewsForm } from 'src/pages/Review';
import { ReviewsListPage } from 'src/pages/ReviewList';

export const reviewListPath = '/';
export const reviewFormPath = '/review-form';

export const PrivateRoutes: FC = () => (
  <Routes>
    <Route path={reviewListPath} element={<ReviewsListPage />} />
    <Route path={`${reviewFormPath}/:id`} element={<ReviewsForm />} />
    <Route path={reviewFormPath} element={<ReviewsForm />} />
  </Routes>
);

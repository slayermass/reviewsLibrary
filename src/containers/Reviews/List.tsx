import { defaultSizePageTable } from "config";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getReviewsList } from "utils/firebase";
import { UiGlobalLoader } from "components/UI/GlobalLoader";
import { IReviewListModel } from "models/Review/interfaces";
import { ReviewsListComponent } from "components/Reviews/ReviewsList";
import { UiEntityNotFound } from "components/UI/EntityNotFound";

export type ReviewsListFilter = {
  perPage: number;
  page: number;
};

export const ReviewsList = (): React.ReactElement => {
  const [model, setModel] = useState<IReviewListModel | null>(null);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<ReviewsListFilter>({
    perPage: defaultSizePageTable,
    page: 1,
  });

  useEffect(() => {
    console.log("filter changed", filter);
  }, [filter]);

  const onSizePageChange = (perPage: number) => {
    setFilter({ ...filter, perPage });
  };

  const onPageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  useEffect(() => {
    getReviewsList()
      .then(setModel)
      .catch((err) => {
        toast.error(`Ошибка получения списка обзоров: "${err.name}"`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <UiGlobalLoader />;
  }
  if (model) {
    return (
      <ReviewsListComponent
        model={model.slice(
          (filter.page - 1) * filter.perPage,
          filter.page * filter.perPage
        )}
        onSizePageChange={onSizePageChange}
        onPageChange={onPageChange}
        page={filter.page}
        perPage={filter.perPage}
        totalAmount={model.length}
      />
    );
  }
  return <UiEntityNotFound text="Обзоров не найдено" />;
};

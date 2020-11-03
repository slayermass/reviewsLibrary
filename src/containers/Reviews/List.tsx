import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { subscribeReviews } from "utils/firebase";
import { defaultSizePageTable } from "config";
import { IReviewListModel } from "models/Review/interfaces";
import { ReviewsListComponent } from "components/Reviews/ReviewsList";
import { ReviewItemModel } from "models/Review";

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
    subscribeReviews().onSnapshot(
      /** type? */
      (response: any) => {
        setLoading(true);

        const resModel = response.docs.map(
          (i: any) => new ReviewItemModel({ id: i.id, ...i.data() })
        );
        setModel(resModel);

        setLoading(false);
      },
      (err: Error) => {
        setLoading(false);
        toast.error(`Ошибка получения списка обзоров: "${err.name}"`);
      }
    );
  }, []);

  return (
    <ReviewsListComponent
      model={
        model
          ? model.slice(
              (filter.page - 1) * filter.perPage,
              filter.page * filter.perPage
            )
          : []
      }
      onSizePageChange={onSizePageChange}
      onPageChange={onPageChange}
      page={filter.page}
      perPage={filter.perPage}
      totalAmount={model ? model.length : 0}
      loading={loading}
    />
  );
};

import { GlobalContext } from "components/Auth/CheckRoute";
import { toast } from "react-toastify";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { ReviewsListComponent } from "components/Reviews/List";
import { defaultSizePageTable } from "config";
import { ReviewItemModel } from "models/Review";
import { IReviewModel } from "models/Review/interfaces";
import { subscribeReviews } from "utils/firebase";

export type ReviewsListFilter = {
  perPage: number;
  page: number;
  group: string;
  album: string;
};

export type OnFilterSearchType = (
  name: "group" | "album"
) => (value: string) => void;

export const ReviewsList = (): React.ReactElement => {
  const [model, setModel] = useState<IReviewModel | null>(null);
  const [loading, setLoading] = useState(true);

  const [modelToRender, setModalToRender] = useState<{
    data: IReviewModel;
    amount: number;
  }>({ data: [], amount: 0 });

  const [filter, setFilter] = useState<ReviewsListFilter>({
    perPage: defaultSizePageTable,
    page: 1,
    group: "",
    album: "",
  });

  /** сложно получилось. надо проще */
  useMemo(() => {
    /** применение всех фильтров */
    let filteredModel: IReviewModel = [];
    const modelToFilter = model || [];

    let total = modelToFilter.length;
    let searched = false;

    /** фильтровать по всем записям */
    if (filter.album.length || filter.group.length) {
      filteredModel = modelToFilter
        .filter((item) =>
          item.group.toLowerCase().includes(filter.group.toLowerCase())
        )
        .filter((item) =>
          item.album.toLowerCase().includes(filter.album.toLowerCase())
        );

      total = filteredModel.length;
      searched = true;
    }

    /** обрезать по вывод страницы */
    filteredModel = (searched ? filteredModel : modelToFilter).slice(
      (filter.page - 1) * filter.perPage,
      filter.page * filter.perPage
    );

    setModalToRender({ data: filteredModel, amount: total });
  }, [filter, model]);

  useEffect(() => {
    console.log("filter changed", filter);
  }, [filter]);

  const onSizePageChange = (perPage: number) => {
    setFilter({ ...filter, perPage });
  };

  const onPageChange = (page: number) => setFilter({ ...filter, page });

  const onFilterSearch: OnFilterSearchType = (name) => (value) => {
    setFilter({ ...filter, [name]: value });
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

  const GlobalContextValue = useContext(GlobalContext);

  return (
    <ReviewsListComponent
      model={modelToRender.data}
      onSizePageChange={onSizePageChange}
      onPageChange={onPageChange}
      onFilterSearch={onFilterSearch}
      page={filter.page}
      perPage={filter.perPage}
      totalAmount={modelToRender.amount}
      loading={loading}
      isExistUser={!GlobalContextValue.isAnonymousUser}
    />
  );
};

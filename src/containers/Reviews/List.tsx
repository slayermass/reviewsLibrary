import { toast } from "react-toastify";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { ReviewsListComponent } from "components/Reviews/List";
import { defaultSizePageTable } from "config";
import { ReviewItemModel } from "models/Review";
import { IReviewModel } from "models/Review/interfaces";
import { subscribeReviews } from "utils/firebase";
import { GlobalContext } from "components/Auth/CheckRoute";

export type ReviewsListFilter = {
  perPage: number;
  page: number;
  group: string;
  album: string;
  rating: number;
};

export type OnFilterSearchType = (
  name: "group" | "album" | "rating"
) => (value: string | number) => void;

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
    rating: 0,
  });

  /** сложно получилось. надо проще */
  useMemo(() => {
    /** применение всех фильтров */
    let filteredModel: IReviewModel = [];
    const modelToFilter = model || [];

    let total = modelToFilter.length;
    let searched = false;

    const { album, group, rating } = filter;
    const lowerGroup = group.toLowerCase();
    const lowerAlbum = album.toLowerCase();

    /** фильтровать по всем записям */
    if (album.length || group.length || rating > 0) {
      filteredModel = modelToFilter
        .filter((item) => item.group.toLowerCase().includes(lowerGroup))
        .filter((item) => item.album.toLowerCase().includes(lowerAlbum))
        .filter((item) => item.rating === rating);

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

  const onSizePageChange = (perPage: number) => {
    setFilter({ ...filter, perPage, page: 1 });
  };

  const onPageChange = (page: number) => setFilter({ ...filter, page });

  const onFilterSearch: OnFilterSearchType = (name) => (value) => {
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    // getReviewsList()
    //   .then(setModel)
    //   .finally(() => {
    //     setLoading(false);
    //   });
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

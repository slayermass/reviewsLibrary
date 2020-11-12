import { toast } from "react-toastify";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { ReviewsListComponent } from "components/Reviews/List";
import { defaultSizePageTable } from "config";
import { ReviewItemModel } from "models/Review";
import { IReviewModel } from "models/Review/interfaces";
import { subscribeReviews } from "utils/firebase";
import { GlobalContext } from "components/Auth/CheckRoute";

export type ListSortType = "none" | "ratingAsc" | "ratingDesc";

export type ReviewsListFilter = {
  perPage: number;
  page: number;
  group: string;
  album: string;
  rating: number;
  sort: ListSortType;
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
    sort: "none",
  });

  /** сложно получилось. надо проще */
  useMemo(() => {
    /** применение всех фильтров */
    let filteredModel: IReviewModel = [];
    const modelToFilter = model || [];

    let total = modelToFilter.length;
    let searched = false;

    const { album, group, rating, sort } = filter;

    /** фильтровать по всем записям */
    if (album.length || group.length || rating > 0) {
      filteredModel = modelToFilter;

      if (album.length) {
        const lowerAlbum = album.toLowerCase();

        filteredModel = filteredModel.filter((item) =>
          item.album.toLowerCase().includes(lowerAlbum)
        );
      }
      if (group.length) {
        const lowerGroup = group.toLowerCase();

        filteredModel = filteredModel.filter((item) =>
          item.group.toLowerCase().includes(lowerGroup)
        );
      }
      if (rating > 0) {
        filteredModel = filteredModel.filter((item) => item.rating === rating);
      }

      total = filteredModel.length;
      searched = true;
    }

    filteredModel = searched ? filteredModel : modelToFilter;

    /**
     * применение сортировки
     * необходима оптимизация - сортировка только n необходимых для показа записей. остальные игнорировать
     */
    switch (sort) {
      case "ratingAsc":
        filteredModel = filteredModel.sort(
          ({ rating: compLeft }, { rating: compRight }) => {
            if (compLeft > compRight) {
              return 1;
            }
            return compLeft < compRight ? -1 : 0;
          }
        );
        break;
      case "ratingDesc":
        filteredModel.sort(({ rating: compLeft }, { rating: compRight }) => {
          if (compLeft < compRight) {
            return 1;
          }
          return compLeft > compRight ? -1 : 0;
        });
        break;
      default:
        filteredModel.sort(({ date: compLeft }, { date: compRight }) => {
          if (compLeft < compRight) {
            return 1;
          }
          return compLeft > compRight ? -1 : 0;
        });
        break;
    }

    /** обрезать по выводу страницы */
    filteredModel = filteredModel.slice(
      (filter.page - 1) * filter.perPage,
      filter.page * filter.perPage
    );

    setModalToRender({ data: filteredModel, amount: total });
  }, [filter, model]);

  const onSizePageChange = (perPage: number) => {
    setFilter({ ...filter, perPage, page: 1 });
  };

  const onPageChange = (page: number) => setFilter({ ...filter, page });

  const onSortChange = (sort: ListSortType) => setFilter({ ...filter, sort });

  const onFilterSearch: OnFilterSearchType = (name) => (value) => {
    setFilter({ ...filter, [name]: value });
  };

  const { isAnonymousUser, userEmail } = useContext(GlobalContext);

  useEffect(() => {
    if (userEmail === null) {
      toast.error("Не указан email. Критическая ошибка");
      return;
    }
    // getReviewsList()
    //   .then(setModel)
    //   .finally(() => {
    //     setLoading(false);
    //   });
    subscribeReviews(userEmail).onSnapshot(
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
        // eslint-disable-next-line no-console
        console.error(err);
        toast.error(`Ошибка получения списка обзоров: "${err.name}"`);
      }
    );
  }, [userEmail]);

  return (
    <ReviewsListComponent
      model={modelToRender.data}
      onSizePageChange={onSizePageChange}
      onPageChange={onPageChange}
      onFilterSearch={onFilterSearch}
      onSortChange={onSortChange}
      page={filter.page}
      perPage={filter.perPage}
      totalAmount={modelToRender.amount}
      loading={loading}
      realUser={!isAnonymousUser}
      userEmail={userEmail}
    />
  );
};

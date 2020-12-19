import { toast } from "react-toastify";
import React, { useContext, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";

import { ReviewsListComponent } from "components/Reviews/List";
import { defaultSizePageTable } from "config";
import { ReviewItemModel } from "models/Review";
import { IReviewModel } from "models/Review/interfaces";
import { GlobalContext } from "components/Auth/CheckRoute";
import {
  comparatorAsc,
  comparatorDesc,
  ListSortType,
} from "containers/Reviews/common";
import { API } from "utils/apiDriver";

const searchInModel = (filteredModel: IReviewModel) => (
  prop: "group" | "album" | "comment",
  value: string
) => filteredModel.filter((item) => item[prop].toLowerCase().includes(value));

export type ReviewsListFilter = {
  perPage: number;
  page: number;
  group: string;
  album: string;
  comment: string;
  rating: number;
  sort: ListSortType;
};

export type OnFilterSearchType = (
  name: "group" | "album" | "rating" | "comment"
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
    comment: "",
    rating: 0,
    sort: "dateDesc",
  });

  /** сложно получилось. надо проще */
  useMemo(() => {
    /** применение всех фильтров */
    let filteredModel: IReviewModel = [];
    const modelToFilter = model || [];

    let total = modelToFilter.length;
    let searched = false;

    const { album, group, rating, sort, comment } = filter;

    /** фильтровать по всем записям */
    if (album.length || group.length || comment.length || rating > 0) {
      filteredModel = modelToFilter;

      if (album.length) {
        filteredModel = searchInModel(filteredModel)("album", album);
      }
      if (group.length) {
        filteredModel = searchInModel(filteredModel)("group", group);
      }
      if (comment.length) {
        filteredModel = searchInModel(filteredModel)("comment", comment);
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
        filteredModel = comparatorAsc(filteredModel)("rating");
        break;

      case "ratingDesc":
        filteredModel = comparatorDesc(filteredModel)("rating");
        break;

      case "dateAsc":
        filteredModel = comparatorAsc(filteredModel)("date");
        break;

      default:
        filteredModel = comparatorDesc(filteredModel)("date");
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

  const onFilterSearch: OnFilterSearchType = (name) =>
    debounce((value) => {
      setFilter({ ...filter, [name]: value });
    }, 300);

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
    API.subscribe(userEmail).onSnapshot(
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

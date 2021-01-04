import { toast } from "react-toastify";
import React, { useContext, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

import { ReviewsListComponent } from "components/Reviews/List";
import { defaultSizePageTable } from "config";
import { IReviewModel, ReviewListFilterType } from "models/Review/interfaces";
import { GlobalContext } from "components/Auth/CheckRoute";
import { ListSortType } from "containers/Reviews/common";
import { API } from "utils/apiDriver";

/**
 * очистка передаваемых параметров без вложенности
 * удаление ""
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const cleanupFilter = (params: ReviewsListFilter) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (typeof value === "string" && value.length === 0) {
        return false;
      }
      return !(typeof value === "number" && value === 0);
    })
  );

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
  const [model, setModel] = useState<IReviewModel>({ data: [], amount: 0 });
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<ReviewsListFilter>({
    perPage: defaultSizePageTable,
    page: 1,
    group: "",
    album: "",
    comment: "",
    rating: 0,
    sort: "dateDesc",
  });

  /** изменение фильтра */
  const changeFilterProp = (prop: keyof ReviewsListFilter, obj?: any) => (
    value: string | number
  ) => setFilter({ ...filter, ...(obj || {}), [prop]: value });

  const onSizePageChange = changeFilterProp("perPage", { page: 1 });
  const onPageChange = changeFilterProp("page");
  const onSortChange = changeFilterProp("sort");

  const onFilterSearchDebounced = useRef(
    debounce((name, value) => {
      // TODO при смене ввода инпутов, теряется предыдущий ввод
      // setFilter({ ...filter, [name]: value });
      changeFilterProp(name)(value);
    }, 500)
  );

  const onFilterSearch: OnFilterSearchType = (name) => (value) => {
    onFilterSearchDebounced.current(name, value);
  };

  const { isAnonymousUser, userEmail } = useContext(GlobalContext);

  /** обращение к апи с фильтрами */
  useEffect(() => {
    setLoading(true);

    API.getList(cleanupFilter(filter) as ReviewListFilterType)
      .then(setModel)
      .catch((e) => {
        toast.error(e.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter]);

  return (
    <ReviewsListComponent
      model={model}
      onSizePageChange={onSizePageChange}
      onPageChange={onPageChange}
      onFilterSearch={onFilterSearch}
      onSortChange={onSortChange}
      filter={filter}
      page={filter.page}
      perPage={filter.perPage}
      loading={loading}
      realUser={!isAnonymousUser}
      userEmail={userEmail}
    />
  );
};

import React, { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

import { ReviewsListComponent } from 'src/pages/ReviewList/component';
import { UserType } from 'src/models/User';
import useGlobalStore from 'src/store';
import useReviewsStore, { ReviewsListFilter } from 'src/store/reviews';
import { SafeAnyType } from 'src/utils/safeAny';

export type OnFilterSearchType = (
  name: 'group' | 'album' | 'rating' | 'comment',
) => (value: string | number | null) => void;

export const ReviewsListPage = (): React.ReactElement => {
  const user = useGlobalStore((state) => state.user.response as UserType);

  const { list, loadList, getList, listFilter } = useReviewsStore((state) => ({
    list: state.list,
    loadList: state.loadList,
    getList: state.getList,
    listFilter: state.listFilter,
  }));

  useEffect(() => {
    getList();
  }, [getList]);

  /** изменение фильтра */
  const changeFilterProp = (prop: keyof ReviewsListFilter, obj?: SafeAnyType) => (value: string | number) => {
    loadList({ ...listFilter, ...(obj || {}), [prop]: value });
  };

  const onSizePageChange = changeFilterProp('perPage', { page: 1 });
  const onPageChange = changeFilterProp('page');
  const onSortChange = changeFilterProp('sort');

  const onFilterSearchDebounced = useRef(
    debounce((name, value) => {
      // TODO при смене ввода инпутов, теряется предыдущий ввод
      changeFilterProp(name)(value);
    }, 800),
  );

  const onFilterSearch: OnFilterSearchType = (name) => (value) => {
    onFilterSearchDebounced.current(name, value);
  };

  return (
    <ReviewsListComponent
      model={list.response}
      onSizePageChange={onSizePageChange}
      onPageChange={onPageChange}
      onFilterSearch={onFilterSearch}
      onSortChange={onSortChange}
      filter={listFilter}
      loading={list.loading}
      realUser={user.email !== null}
      userEmail={user.email}
    />
  );
};

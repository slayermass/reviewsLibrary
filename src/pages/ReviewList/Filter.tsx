import ClearIcon from '@mui/icons-material/Clear';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import React from 'react';

import useReviewsStore from 'src/store/reviews';
import { RecursiveNullable } from 'src/utils/types';
import { UiInput } from 'src/components/UI/inputs/UiInput';
import { SelectOptionsType, UiSelect } from 'src/components/UI/inputs/UiSelect';
import { SafeAnyType } from 'src/utils/safeAny';
import { StateFormReturnType, useStateForm } from 'src/utils/stateForm';
import { OnFilterSearchType } from 'src/pages/ReviewList/index';
import { ratingList } from 'src/config';
import { ListSortType } from 'src/models/Review/common';

const sortOptions: SelectOptionsType = [
  { value: 'dateDesc', label: 'Дата по убыванию' },
  { value: 'dateAsc', label: 'Дата по возрастанию' },
  { value: 'ratingAsc', label: 'Рейтинг по возрастанию' },
  { value: 'ratingDesc', label: 'Рейтинг по убыванию' },
];

const ratingOptions: SelectOptionsType = [{ label: 'Любой', value: 0 }].concat(
  ratingList.map((r: SafeAnyType) => ({
    value: r,
    label: r.toString(),
  })),
);

type Props = {
  onFilterSearch: OnFilterSearchType;
  onSortChange: (sort: ListSortType) => void;
};

type FormValues = RecursiveNullable<{
  group: string;
  album: string;
  comment: string;
  rating: number;
  sort: ListSortType;
}>;

const Input = ({
  formProps,
  name,
  label,
  onFilterSearch,
}: {
  formProps: StateFormReturnType;
  name: 'group' | 'album' | 'rating' | 'comment';
  label: string;
  onFilterSearch: OnFilterSearchType;
}) => (
  <UiInput
    formProps={formProps}
    name={name}
    variant="standard"
    label={label}
    onChange={onFilterSearch(name)}
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          onClick={() => {
            formProps.setValue(name, '');

            onFilterSearch(name)('');
          }}
        >
          <ClearIcon />
        </IconButton>
      </InputAdornment>
    }
  />
);

export const ReviewsFilter = ({ onFilterSearch, onSortChange }: Props): React.ReactElement => {
  const listFilter = useReviewsStore((state) => state.listFilter);

  const formProps = useStateForm<FormValues>({
    defaultValues: {
      sort: listFilter.sort,
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Input formProps={formProps} name="group" label="Группа" onFilterSearch={onFilterSearch} />
      </Grid>
      <Grid item xs={3}>
        <Input formProps={formProps} name="album" label="Альбом" onFilterSearch={onFilterSearch} />
      </Grid>
      <Grid item xs={3}>
        <Input formProps={formProps} name="comment" label="Комментарий" onFilterSearch={onFilterSearch} />
      </Grid>
      <Grid item xs={1}>
        <UiSelect
          formProps={formProps}
          name="rating"
          label="Рейтинг"
          options={ratingOptions}
          onChange={onFilterSearch('rating')}
        />
      </Grid>
      <Grid item xs={2}>
        <UiSelect
          formProps={formProps}
          name="sort"
          label="Сортировка"
          options={sortOptions}
          onChange={(value) => {
            onSortChange(value as ListSortType);
          }}
        />
      </Grid>
    </Grid>
  );
};

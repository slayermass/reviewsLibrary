import React from 'react';
import { SafeAnyType } from 'src/utils/safeAny';
import styled from 'styled-components';

import { UiInput } from 'src/components/UI/inputs/Input';
import { OnFilterSearchType } from 'src/pages/ReviewList';
import { ratingList } from 'src/config';
import { SelectOptionsType, UiSelect } from 'src/components/UI/inputs/Select';
import { StyledCol, StyledRow } from 'src/components/UI/styled/StyledGrid';
import { ListSortType } from 'src/containers/Reviews/common';
import { prepareText } from 'src/utils/prepareText';
import { ReviewsListFilter } from 'src/store/reviews';

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

const Wrapper = styled(StyledRow)`
  margin-bottom: 0.5rem;
`;

const DoubleCol = styled(StyledCol)`
  width: calc(100% / 2 - 2rem);
`;

type Props = {
  onFilterSearch: OnFilterSearchType;
  onSortChange: (sort: ListSortType) => void;
  values: ReviewsListFilter;
};

export const ReviewsFilter = ({ onFilterSearch, onSortChange, values }: Props): React.ReactElement => (
  <Wrapper>
    <StyledCol>
      <UiInput
        value={values.group}
        label="Группа"
        onChange={(v: SafeAnyType) => onFilterSearch('group')(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <UiInput
        value={values.album}
        label="Альбом"
        onChange={(v: SafeAnyType) => onFilterSearch('album')(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <UiInput
        value={values.comment}
        label="Комментарий"
        onChange={(v: SafeAnyType) => onFilterSearch('comment')(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <StyledRow>
        <StyledCol>
          <UiSelect
            label="Рейтинг"
            onChange={(v: SafeAnyType) => onFilterSearch('rating')(+v)}
            options={ratingOptions}
          />
        </StyledCol>
        <DoubleCol>
          <UiSelect
            label="Сортировка"
            onChange={(v: SafeAnyType) => onSortChange(v as ListSortType)}
            options={sortOptions}
          />
        </DoubleCol>
      </StyledRow>
    </StyledCol>
  </Wrapper>
);

import React from "react";
import styled from "styled-components";

import { UiInput } from "components/UI/inputs/Input";
import { OnFilterSearchType } from "containers/Reviews/List";
import { ratingList } from "config";
import { SelectOptionsType, UiSelect } from "components/UI/inputs/Select";
import { StyledCol, StyledRow } from "components/UI/styled/StyledGrid";
import { ListSortType } from "containers/Reviews/common";
import { prepareText } from 'utils/prepareText';

const sortOptions: SelectOptionsType = [
  { value: "dateDesc", label: "Дата по убыванию" },
  { value: "dateAsc", label: "Дата по возрастанию" },
  { value: "ratingAsc", label: "Рейтинг по возрастанию" },
  { value: "ratingDesc", label: "Рейтинг по убыванию" },
];

const ratingOptions: SelectOptionsType = [{ label: "Любой", value: 0 }].concat(
  ratingList.map((r) => ({
    value: r,
    label: r.toString(),
  }))
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
};

export const ReviewsFilter = ({
  onFilterSearch,
  onSortChange,
}: Props): React.ReactElement => (
  <Wrapper>
    <StyledCol>
      <UiInput
        label="Группа"
        onChange={(v) => onFilterSearch("group")(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <UiInput
        label="Альбом"
        onChange={(v) => onFilterSearch("album")(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <UiInput
        label="Комментарий"
        onChange={(v) => onFilterSearch("comment")(prepareText(v))}
        showClear
        maxLength={100}
      />
    </StyledCol>
    <StyledCol>
      <StyledRow>
        <StyledCol>
          <UiSelect
            label="Рейтинг"
            onChange={(v) => onFilterSearch("rating")(+v)}
            options={ratingOptions}
          />
        </StyledCol>
        <DoubleCol>
          <UiSelect
            label="Сортировка"
            onChange={(v) => onSortChange(v as ListSortType)}
            options={sortOptions}
          />
        </DoubleCol>
      </StyledRow>
    </StyledCol>
  </Wrapper>
);

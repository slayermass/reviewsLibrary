import React from "react";
import styled from "styled-components";

import { UiInput } from "components/UI/inputs/Input";
import { OnFilterSearchType } from "containers/Reviews/List";
import { ratingList } from "config";
import { UiSelect } from "components/UI/inputs/Select";
import { StyledCol, StyledRow } from "components/UI/styled/StyledGrid";

const Wrapper = styled(StyledRow)`
  margin-bottom: 0.5rem;
`;

type Props = {
  onFilterSearch: OnFilterSearchType;
};

export const ReviewsFilter = ({
  onFilterSearch,
}: Props): React.ReactElement => (
  <Wrapper>
    <StyledCol>
      <UiInput label="Группа" onChange={onFilterSearch("group")} showClear />
    </StyledCol>
    <StyledCol>
      <UiInput label="Альбом" onChange={onFilterSearch("album")} showClear />
    </StyledCol>
    <StyledCol>
      <UiSelect onChange={onFilterSearch("rating")} options={ratingList} />
    </StyledCol>
  </Wrapper>
);

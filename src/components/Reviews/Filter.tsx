import React from "react";
import styled from "styled-components";

import { UiInput } from "components/UI/inputs/Input";
import { OnFilterSearchType } from "containers/Reviews/List";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1rem;
  margin-bottom: 0.5rem;
`;
const Col = styled.div`
  width: calc(100% / 3 - 2rem);

  padding: 0 1rem;
`;

type Props = {
  onFilterSearch: OnFilterSearchType;
};

export const ReviewsFilter = ({
  onFilterSearch,
}: Props): React.ReactElement => (
  <Wrapper>
    <Col>
      <UiInput label="Группа" onChange={onFilterSearch("group")} showClear />
    </Col>
    <Col>
      <UiInput label="Альбом" onChange={onFilterSearch("album")} showClear />
    </Col>
  </Wrapper>
);

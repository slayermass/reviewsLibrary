import { SvgStar } from "assets/svg/star";
import React, { memo } from "react";
import styled from "styled-components";

const WrapStarBlock = styled.div`
  min-width: 130px;

  svg {
    width: 24px;
    path {
      fill: ${(p) => (p.color ? p.color : "#bdc1c7")};
      width: 1em;
      height: 1em;
      display: inline-block;
      font-size: 24px;
      transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      user-select: none;
      flex-shrink: 0;
    }
  }
`;

/** быстрохак для обрезания svg */
export const SemiStar = styled.div`
  display: inline-block;
  width: 12px;
  height: 24px;
  position: relative;
  left: -12px;
  background: white;
`;

type Props = {
  rating: number;
};

export const UiStarsBlock = memo(
  ({ rating }: Props): React.ReactElement => {
    let color: string;

    switch (rating) {
      case 1:
      case 2:
        color = "#ff6f7c";
        break;
      case 3:
      case 4:
        color = "#bdc1c7";
        break;
      case 5:
      case 6:
        color = "#f7d56c";
        break;
      case 7:
      case 8:
        color = "#9ccdff";
        break;
      case 9:
      case 10:
        color = "#7ed693";
        break;
      default:
        color = "#bdc1c7";
    }

    const isFloatRating = rating % 1 === 0;

    return (
      <WrapStarBlock color={color}>
        {new Array(Math.ceil(rating / 2)).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <SvgStar key={i} />
        ))}
        {isFloatRating && <SemiStar />}
      </WrapStarBlock>
    );
  }
);

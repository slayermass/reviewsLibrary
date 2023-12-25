import { SvgStar } from "src/assets/svg/star";
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

    &.half {
      width: 12px;
    }
  }
`;

type Props = {
  rating: number;
};

export const UiStarsBlock = memo(({ rating }: Props): React.ReactElement => {
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

  const rating5 = rating / 2;
  const isFloatRating = rating5 % 1 !== 0;
  const starsAmount = Math.ceil(rating5);

  return (
    <WrapStarBlock color={color}>
      {new Array(starsAmount).fill(null).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SvgStar key={i} half={starsAmount - 1 === i && isFloatRating} />
      ))}
    </WrapStarBlock>
  );
});

import React, { memo } from "react";
import styled from "styled-components";

export const SvgStar = memo(
  (): React.ReactElement => (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  )
);

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

type BlockProps = {
  rating: number;
};

export const SvgStarBlock = memo(
  ({ rating }: BlockProps): React.ReactElement => {
    let color: string;

    switch (rating) {
      case 1:
        color = "#ff6f7c";
        break;
      case 2:
        color = "#bdc1c7";
        break;
      case 3:
        color = "#f7d56c";
        break;
      case 4:
        color = "#9ccdff";
        break;
      case 5:
        color = "#7ed693";
        break;
      default:
        color = "#bdc1c7";
    }

    return (
      <WrapStarBlock color={color}>
        {new Array(rating).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <SvgStar key={i} />
        ))}
      </WrapStarBlock>
    );
  }
);

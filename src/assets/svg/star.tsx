import React, { memo } from "react";

type Props = {
  half?: boolean; // пол звезды?
};

export const SvgStar = memo(
  ({ half = false }: Props): React.ReactElement => (
    <svg
      className={half ? "half" : undefined}
      focusable="false"
      viewBox={half ? "0 0 12 24" : "0 0 24 24"}
      aria-hidden="true"
      role="presentation"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  )
);

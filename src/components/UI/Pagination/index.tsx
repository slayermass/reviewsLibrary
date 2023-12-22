import React, { ChangeEvent, memo } from "react";
import styled from "styled-components";

import { SvgToBack } from "src/assets/svg/toBack";
import { SvgToEnd } from "src/assets/svg/toEnd";
import { SvgToNext } from "src/assets/svg/toNext";
import { SvgToStart } from "src/assets/svg/toStart";
import { defaultSizeByPageTable } from "src/config";

const SVGButton = styled.button`
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  ${(p) => p.disabled && "pointer-events: none;opacity: 0.5;"}
  background: transparent;
  border: none;
  flex: 0 0 auto;
  color: rgba(0, 0, 0, 0.54);
  padding: 12px;
  overflow: visible;
  font-size: 1.5rem;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  width: 48px;
  height: 48px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  &:focus {
    outline: none;
  }
  &:active {
    svg path {
      fill: #31373c;
    }
  }

  svg {
    path {
      fill: rgba(0, 0, 0, 0.54);
    }
    width: 24px;
    height: 24px;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  line-height: 20px;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: -1rem;
  align-items: center;

  select {
    margin: 0 3em 0 1rem;
    outline: none;
    border: none;
    background: transparent;
    padding: 5px 0;

    &:active,
    &:focus {
      background: #fafafa;
    }
  }
`;

const TotalInfo = styled.span`
  margin-right: 5px;
`;

type Props = {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onSizePageChange: (p: number) => void;
};

export const UiPagination = memo(
  ({
    total,
    onPageChange,
    onSizePageChange,
    page,
    perPage,
  }: Props): React.ReactElement => {
    const lastPage = Math.ceil(total / perPage);
    const currentMin = page === 1 ? 1 : perPage * (page - 1) + 1;
    let currentMax = perPage * page;
    currentMax = currentMax > total ? total : currentMax;

    return (
      <FooterInfo>
        <span>На странице:</span>
        <select
          onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
            onSizePageChange(+value);
          }}
          defaultValue={perPage}
        >
          {defaultSizeByPageTable.map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
        <TotalInfo>
          {currentMin}&ndash;
          {currentMax} из {total}
        </TotalInfo>
        <div>
          <SVGButton
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <SvgToStart />
          </SVGButton>
          <SVGButton
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <SvgToBack />
          </SVGButton>
          <SVGButton
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === lastPage}
          >
            <SvgToNext />
          </SVGButton>
          <SVGButton
            type="button"
            onClick={() => onPageChange(lastPage)}
            disabled={page === lastPage}
          >
            <SvgToEnd />
          </SVGButton>
        </div>
      </FooterInfo>
    );
  },
);

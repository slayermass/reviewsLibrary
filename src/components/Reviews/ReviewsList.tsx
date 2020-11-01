import { SvgToBack } from "assets/svg/toBack";
import { SvgToEnd } from "assets/svg/toEnd";
import { SvgToNext } from "assets/svg/toNext";
import { SvgToStart } from "assets/svg/toStart";
import { defaultSizeByPageTable, defaultSizePageTable } from "config";
import { ReviewsListFilter } from "containers/Reviews/List";
import React, { ChangeEvent } from "react";
import { IReviewItemModel, IReviewListModel } from "models/Review/interfaces";
import styled from "styled-components";
import { CDate } from "utils/CDate";

const Wrapper = styled.div`
  padding: 20px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  border-radius: 4px;
  margin: 64px 36px;
`;

const Header = styled.h1`
  font-weight: 500;
  background-color: #f5f8fa;
  color: #31373c;
  z-index: 1100;
  position: fixed;
  height: 64px;
  margin: 0;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 36px;
  margin-top: -4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableTR = styled.tr`
  color: inherit;
  height: 48px;
  outline: none;
  vertical-align: middle;

  &:hover {
    background-color: #fafafa;
    cursor: pointer;
  }
`;

const TableHead = styled.thead`
  & > ${TableTR} {
    &:hover {
      background-color: initial;
      cursor: initial;
    }
  }
`;

const TableTD = styled.td`
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  padding: 4px 56px 4px 24px;
  text-align: left;
  vertical-align: inherit;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.8125rem;
  font-weight: 400;
`;

const TableFoot = styled.tfoot`
  & > ${TableTR} {
    & > ${TableTD} {
      border: none;
    }

    &:hover {
      background-color: initial;
      cursor: initial;
    }
  }
`;

const FooterInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  line-height: 20px;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.54);

  select {
    margin: 0 3em 0 1rem;
  }
`;

const TableTH = styled(TableTD)`
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.75rem;
  font-weight: 500;
`;

const SVGButton = styled.button`
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  ${(p) => p.disabled && "pointer-events: none;"}
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

type Props = {
  model: IReviewListModel;
  filter: ReviewsListFilter;
  onSizePageChange: (p: number) => void;
};

export const ReviewsListComponent = ({
  model,
  filter,
  onSizePageChange,
}: Props): React.ReactElement => {
  console.log(model);
  return (
    <>
      <Header>Музыкальные обзоры</Header>
      <Wrapper>
        <Table>
          <TableHead>
            <TableTR>
              <TableTH>Группа</TableTH>
              <TableTH>Альбом</TableTH>
              <TableTH>Рейтинг</TableTH>
              <TableTH>Комментарий</TableTH>
              <TableTH>Дата</TableTH>
            </TableTR>
          </TableHead>
          <tbody>
            {model.map((item: IReviewItemModel) => (
              <TableTR key={item.id}>
                <TableTD>{item.group}</TableTD>
                <TableTD>{item.album}</TableTD>
                <TableTD>{item.rating}</TableTD>
                <TableTD>{item.comment}</TableTD>
                <TableTD>
                  {CDate.format(item.date, "d MMMM yyyy HH:mm'")}
                </TableTD>
              </TableTR>
            ))}
          </tbody>
          <TableFoot>
            <TableTR>
              <TableTD colSpan={10}>
                <FooterInfo>
                  <span>На странице:</span>
                  <select
                    onChange={({
                      target: { value },
                    }: ChangeEvent<HTMLSelectElement>) => {
                      onSizePageChange(+value);
                    }}
                    defaultValue={filter.perPage}
                  >
                    {defaultSizeByPageTable.map((size) => (
                      <option value={size} key={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span>
                    {filter.perPage} из {model.length}
                  </span>
                </FooterInfo>
              </TableTD>
            </TableTR>
          </TableFoot>
        </Table>

        {/** pagination */}
        <div>
          <SVGButton type="button" disabled>
            <SvgToStart />
          </SVGButton>
          <SVGButton type="button">
            <SvgToBack />
          </SVGButton>
          <SVGButton type="button">
            <SvgToNext />
          </SVGButton>
          <SVGButton type="button">
            <SvgToEnd />
          </SVGButton>
        </div>
      </Wrapper>
    </>
  );
};

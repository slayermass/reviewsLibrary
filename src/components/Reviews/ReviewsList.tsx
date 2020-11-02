import React from "react";
import styled from "styled-components";

import { UiPagination } from "components/UI/Pagination";
import { IReviewItemModel, IReviewListModel } from "models/Review/interfaces";
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
      padding: 4px 0 0 0;
      border: none;
    }

    &:hover {
      background-color: initial;
      cursor: initial;
    }
  }
`;

const TableTH = styled(TableTD)`
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.75rem;
  font-weight: 400;
`;

type Props = {
  model: IReviewListModel;
  onSizePageChange: (p: number) => void;
  onPageChange: (p: number) => void;
  page: number;
  perPage: number;
  totalAmount: number;
};

export const ReviewsListComponent = ({
  model,
  onSizePageChange,
  onPageChange,
  page,
  perPage,
  totalAmount,
}: Props): React.ReactElement => (
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
                {CDate.format(item.date, "d MMMM yyyy, HH:mm:ss'")}
              </TableTD>
            </TableTR>
          ))}
        </tbody>
        <TableFoot>
          <TableTR>
            <TableTD colSpan={10}>
              <UiPagination
                total={totalAmount}
                onPageChange={onPageChange}
                onSizePageChange={onSizePageChange}
                page={page}
                perPage={perPage}
              />
            </TableTD>
          </TableTR>
        </TableFoot>
      </Table>
    </Wrapper>
  </>
);

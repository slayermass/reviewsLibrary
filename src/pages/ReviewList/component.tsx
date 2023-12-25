import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React, { FC } from 'react';

import { defaultSizeByPageTable } from 'src/config';
import { ReviewsFilter } from 'src/pages/ReviewList/Filter';
import { UiLoader } from 'src/components/UI/Loaders';
import { UiStarsBlock } from 'src/components/UI/StarsBlock';
import { ListSortType } from 'src/models/Review/common';
import { OnFilterSearchType } from 'src/pages/ReviewList/index';
import { IReviewItemModel, IReviewModel } from 'src/models/Review/interfaces';
import { CDate } from 'src/utils/CDate';
import { Link, useNavigate } from 'react-router-dom';
import { reviewFormPath } from 'src/routes/private';
import { ReviewsListFilter } from 'src/store/reviews';

type Props = {
  model: IReviewModel;
  onSizePageChange: (p: number) => void;
  onPageChange: (p: number) => void;
  onSortChange: (sort: ListSortType) => void;
  loading: boolean;
  onFilterSearch: OnFilterSearchType;
  realUser: boolean; // реальный ли пользователь ( не аноним )
  userEmail: string | null;
  filter: ReviewsListFilter;
};

export const ReviewsListComponent: FC<Props> = ({
  model,
  onSizePageChange,
  onPageChange,
  onSortChange,
  loading,
  onFilterSearch,
  realUser,
  userEmail,
  filter,
}) => {
  const navigate = useNavigate();

  const onTrClick = (itemModel: IReviewItemModel) => () => {
    if (realUser) {
      navigate(`${reviewFormPath}/${itemModel.id}`, {
        state: {
          model: itemModel,
        },
      });
    }
  };

  return (
    <Container maxWidth={false}>
      <Box>
        <Typography variant="h4" component="h1" align="center" sx={{ mt: 4, mb: 4 }}>
          Музыкальные обзоры ({userEmail || 'Почта не указана'})
        </Typography>
      </Box>
      <Box>
        <ReviewsFilter onFilterSearch={onFilterSearch} onSortChange={onSortChange} />

        <Box display="flex" justifyContent="center" alignItems="center">
          {realUser && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mt: 2, mb: 2, px: 10 }}
              component={Link}
              to={reviewFormPath}
            >
              Создать обзор
            </Button>
          )}
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Группа</TableCell>
                <TableCell>Альбом</TableCell>
                <TableCell>Рейтинг</TableCell>
                <TableCell>Комментарий</TableCell>
                <TableCell>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box
                      sx={{
                        height: '50vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <UiLoader color="#3f51b5" />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {model.data.map((item: IReviewItemModel) => (
                    <TableRow key={item.id} hover onClick={onTrClick(item)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{item.group}</TableCell>
                      <TableCell>{item.album}</TableCell>
                      <TableCell>
                        <UiStarsBlock rating={item.rating} />
                      </TableCell>
                      <TableCell>{item.comment}</TableCell>
                      <TableCell>{CDate.format(item.date, "d MMMM yyyy, HH:mm:ss'")}</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  <TablePagination
                    rowsPerPageOptions={defaultSizeByPageTable}
                    component="div"
                    count={model.amount}
                    rowsPerPage={filter.perPage}
                    labelRowsPerPage="На странице"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} из ${count !== -1 ? count : `Более чем ${to}`}`
                    }
                    page={filter.page - 1}
                    showFirstButton
                    showLastButton
                    onPageChange={(_, page) => {
                      onPageChange(page + 1);
                    }}
                    onRowsPerPageChange={({ target: { value } }) => {
                      onSizePageChange(+value);
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

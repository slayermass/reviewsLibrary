import LoadingButton from '@mui/lab/LoadingButton';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStateForm } from 'src/utils/stateForm';
import { RecursiveNonNullable, RecursiveNullable } from 'src/utils/types';
import { IReviewForm, IReviewItemModel } from 'src/models/Review/interfaces';
import { prepareText } from 'src/utils/prepareText';
import { SafeAnyType } from 'src/utils/safeAny';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { UiInput } from 'src/components/UI/inputs/UiInput';

const getOrElse = (obj: Record<string, SafeAnyType> | null, prop: string, elseValue: SafeAnyType) =>
  obj && obj[prop] !== undefined && obj[prop] !== null ? obj[prop] : elseValue;

type Props = {
  model: IReviewItemModel | null;
  onSave: (d: IReviewForm) => void;
  isSaving: boolean;
  canSave: boolean;
  userEmail: string | null;
};

type FormValues = RecursiveNullable<{
  group: string;
  album: string;
  rating: number;
  comment: string;
}>;

export const ReviewFormComponent = ({ model, onSave, isSaving, canSave, userEmail }: Props): React.ReactElement => {
  const navigate = useNavigate();

  const [isSubmitActive, setIsSubmitActive] = useState(false);

  const formProps = useStateForm<FormValues>({
    defaultValues: {
      rating: 5,
    },
    onAnyValueChanged: (formData) => {
      if (
        (formData.group?.length || 0) >= 1 &&
        (formData.album?.length || 0) >= 1 &&
        (formData.comment?.length || 0) >= 1 &&
        (formData.rating || 0) >= 1 &&
        (formData.rating || 0) <= 10
      ) {
        setIsSubmitActive(true);
      } else {
        setIsSubmitActive(false);
      }
    },
  });

  const onReset = useCallback(() => navigate(-1), [navigate]);

  const onSubmit = (formData: FormValues) => {
    if (canSave) {
      const data = formData as RecursiveNonNullable<FormValues>;

      const numberRating = +data.rating;

      onSave({
        group: prepareText(data.group),
        album: prepareText(data.album),
        // eslint-disable-next-line no-nested-ternary
        rating: numberRating > 10 ? 10 : numberRating < 1 ? 1 : numberRating,
        comment: prepareText(data.comment),
        date: getOrElse(model, 'date', new Date()),
        author: userEmail || '',
      });
    }
  };

  return (
    <Container maxWidth={false}>
      <Box>
        <Typography variant="h4" component="h1" align="center" sx={{ mt: 4, mb: 4 }}>
          Форма {model === null ? 'создания' : 'редактирования'} обзора ({userEmail || 'Почта не указана'})
        </Typography>
      </Box>

      <Paper
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <form onSubmit={formProps.onSubmit(onSubmit)} onReset={onReset}>
          <UiInput formProps={formProps} name="group" label="Группа" variant="standard" required />
          <UiInput formProps={formProps} name="album" label="Альбом" variant="standard" required />
          <UiInput formProps={formProps} name="rating" label="Оценка" type="number" variant="standard" required />
          <UiInput formProps={formProps} name="comment" label="Комментарий" variant="standard" required />
          {canSave && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <Button type="reset" variant="outlined">
                Отмена
              </Button>
              <LoadingButton type="submit" variant="outlined" loading={isSaving} disabled={!isSubmitActive}>
                <span>Сохранить</span>
              </LoadingButton>
            </Box>
          )}
        </form>
      </Paper>
    </Container>
  );
};

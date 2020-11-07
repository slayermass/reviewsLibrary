import React, { SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { UiLoaderSubmitButton } from "components/UI/buttons/LoaderButton";
import { UiInput } from "components/UI/inputs/Input";
import { StyledHeader } from "components/UI/styled/StyledHeader";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";

const Card = styled.div`
  background: #fff;
  margin: 64px 36px;
  padding: 20px;
`;

const InputRow = styled.div`
  padding: 10px 0;
`;

const getOrElse = (
  obj: Record<string, any> | null,
  prop: string,
  elseValue: any
) =>
  obj && obj[prop] !== undefined && obj[prop] !== null ? obj[prop] : elseValue;

type Props = {
  model: IReviewItemModel | null;
  onSave: (d: IReviewForm) => void;
  isSaving: boolean;
  canSave: boolean;
};

export const ReviewFormComponent = ({
  model,
  onSave,
  isSaving,
  canSave,
}: Props): React.ReactElement => {
  const [isSubmitActive, setIsSubmitActive] = useState(false);

  const [group, setGroup] = useState(getOrElse(model, "group", ""));
  const [album, setAlbum] = useState(getOrElse(model, "album", ""));
  const [rating, setRating] = useState(getOrElse(model, "rating", 5));
  const [comment, setComment] = useState(getOrElse(model, "comment", ""));

  useEffect(() => {
    if (
      group.length &&
      album.length &&
      comment.length &&
      rating >= 1 &&
      rating <= 10
    ) {
      setIsSubmitActive(true);
    } else if (isSubmitActive) {
      setIsSubmitActive(false);
    }
  }, [group, album, rating, comment]);

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSave) {
      return;
    }

    onSave({
      group: group.toLowerCase(),
      album: album.toLowerCase(),
      rating,
      comment: comment.toLowerCase(),
      date: getOrElse(model, "date", new Date()),
    });
  };

  return (
    <Card>
      <StyledHeader>
        Форма {model === null ? "создания" : "редактирования"} обзора
      </StyledHeader>

      <form onSubmit={onSubmit}>
        <InputRow>
          <UiInput label="Группа" onChange={setGroup} value={group} />
        </InputRow>
        <InputRow>
          <UiInput label="Альбом" onChange={setAlbum} value={album} />
        </InputRow>
        <InputRow>
          <UiInput
            label="Оценка"
            onChange={setRating}
            type="number"
            min={1}
            max={10}
            value={rating}
          />
        </InputRow>
        <InputRow>
          <UiInput label="Комментарий" onChange={setComment} value={comment} />
        </InputRow>

        {canSave && (
          <UiLoaderSubmitButton
            disabled={!isSubmitActive}
            loading={isSaving}
            text="Сохранить"
          />
        )}
      </form>
    </Card>
  );
};

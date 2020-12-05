import { useHistory } from "react-router-dom";
import styled from "styled-components";
import trim from "lodash/trim";
import lowerCase from "lodash/lowerCase";

import { UiLoaderSubmitButton } from "components/UI/buttons/LoaderButton";
import { UiInput } from "components/UI/inputs/Input";
import { StyledButton } from "components/UI/styled/StyledButton";
import { StyledHeader } from "components/UI/styled/StyledHeader";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";

const Card = styled.div`
  margin: 64px 36px;
  padding: 20px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  background: #fff;
  border-radius: 4px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
const InputRow = styled.div`
  padding: 10px 0;
`;

const CancelButton = styled(StyledButton)`
  color: #3f51b5;
  border: 1px solid rgba(63, 81, 181, 0.5);

  &:hover {
    border: 1px solid #3f51b5;
    background-color: rgba(63, 81, 181, 0.08);
  }
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
  userEmail: string | null;
};

export const ReviewFormComponent = ({
  model,
  onSave,
  isSaving,
  canSave,
  userEmail,
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

  const history = useHistory();

  const onReset = useCallback(() => history.goBack(), [history]);

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSave) {
      return;
    }

    onSave({
      group: trim(lowerCase(group)),
      album: trim(lowerCase(album)),
      rating: rating > 10 ? 10 : rating,
      comment: trim(lowerCase(comment)),
      date: getOrElse(model, "date", new Date()),
      author: userEmail || "",
    });
  };

  return (
    <>
      <StyledHeader>
        Форма {model === null ? "создания" : "редактирования"} обзора (
        {userEmail || "Почта не указана"})
      </StyledHeader>
      <Card>
        <form onSubmit={onSubmit} onReset={onReset}>
          <InputRow>
            <UiInput
              label="Группа"
              onChange={setGroup}
              value={group}
              maxLength={100}
            />
          </InputRow>
          <InputRow>
            <UiInput
              label="Альбом"
              onChange={setAlbum}
              value={album}
              maxLength={100}
            />
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
            <UiInput
              label="Комментарий"
              onChange={setComment}
              value={comment}
              maxLength={600}
            />
          </InputRow>

          {canSave && (
            <Buttons>
              <CancelButton type="reset">Отмена</CancelButton>
              <UiLoaderSubmitButton
                disabled={!isSubmitActive}
                loading={isSaving}
                text="Сохранить"
              />
            </Buttons>
          )}
        </form>
      </Card>
    </>
  );
};

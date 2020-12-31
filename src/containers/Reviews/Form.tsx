import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { API } from "utils/apiDriver";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
import { UiGlobalLoader } from "components/UI/Loaders";
import { ReviewFormComponent } from "components/Reviews/Form";
import { GlobalContext, reviewListPath } from "components/Auth/CheckRoute";

export const ReviewsForm = (): React.ReactElement => {
  const { id } = useParams<{ id?: string }>();

  const {
    push,
    location: { state },
  } = useHistory<{ model?: IReviewItemModel }>();

  const { isAnonymousUser, userEmail } = useContext(GlobalContext);

  const [, setCreateMode] = useState(true);
  const [model, setModel] = useState<IReviewItemModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    new Promise((resolve) => {
      if (state && state.model) {
        setLoading(false);
        setModel(state.model);
      } else if (id && id.length > 0) {
        setLoading(true);
        resolve(id);
      } else {
        setLoading(false);
      }
    })
      .then((modelId: any) => API.getReviewById(modelId))
      .then((responseModel: IReviewItemModel | null) => {
        if (responseModel) {
          setCreateMode(false);
        }
        setModel(responseModel);
      })
      .catch(toast.error)
      .finally(() => {
        setLoading(false);
      });
  }, [id, state]);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(
    (data: IReviewForm) => {
      if (isAnonymousUser) {
        return;
      }

      new Promise((resolve) => {
        setIsSaving(true);

        if (model === null) {
          resolve(API.createReview(data));
        } else if (id) {
          resolve(API.updateReview(id, data));
        } else {
          toast.error("Непредвиденная ситуация при сохранении");
          setIsSaving(false);
        }
      })
        .then(() => {
          toast.success("Успешно сохранено");
          push(reviewListPath);
        })
        .catch(toast.error);
    },
    [id, model]
  );

  return loading ? (
    <UiGlobalLoader />
  ) : (
    <ReviewFormComponent
      model={model}
      onSave={onSave}
      isSaving={isSaving}
      canSave={!isAnonymousUser}
      userEmail={userEmail}
    />
  );
};

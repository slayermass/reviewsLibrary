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
    if (state && state.model) {
      setLoading(false);
      setModel(state.model);
    } else if (id && id.length > 0) {
      setLoading(true);

      API.getReviewById(id)
        .then((responseModel: IReviewItemModel | null) => {
          if (responseModel) {
            setCreateMode(false);
          }
          setModel(responseModel);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, state]);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(
    (data: IReviewForm) => {
      if (isAnonymousUser) {
        return;
      }

      setIsSaving(true);

      const fnSave =
        model && id
          ? () => API.updateReview(id, data)
          : () => API.createReview(data);

      fnSave()
        .then(() => {
          toast.success("Успешно сохранено");
          push(reviewListPath);
        })
        .catch((e) => {
          toast.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [id, model]
  );

  if (loading) {
    return <UiGlobalLoader />;
  }
  return (
    <ReviewFormComponent
      model={model}
      onSave={onSave}
      isSaving={isSaving}
      canSave={!isAnonymousUser}
      userEmail={userEmail}
    />
  );
};

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { createReview, getReviewById, updateReview } from "utils/firebase";
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
import { UiGlobalLoader } from "components/UI/Loaders";
import { ReviewFormComponent } from "components/Reviews/Form";
import { GlobalContext, reviewListPath } from "components/Auth/CheckRoute";

export const ReviewsForm = (): React.ReactElement => {
  const { id } = useParams<{ id?: string }>();

  const history = useHistory();

  const { isAnonymousUser, userEmail } = useContext(GlobalContext);

  const [, setCreateMode] = useState(true);
  const [model, setModel] = useState<IReviewItemModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id.length > 0) {
      setLoading(true);

      getReviewById(id)
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
  }, [id]);

  const [isSaving, setIsSaving] = useState(false);

  const onSave = useCallback(
    (data: IReviewForm) => {
      if (isAnonymousUser) {
        return;
      }

      setIsSaving(true);

      /** создание */
      if (model === null) {
        createReview(data)
          .then(() => {
            toast.success("Успешно сохранено");
            history.push(reviewListPath);
          })
          .catch((e) => {
            toast.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      } else if (id) {
        updateReview(id, data)
          .then(() => {
            toast.success("Успешно сохранено");
            history.push(reviewListPath);
          })
          .catch((e) => {
            toast.error(e);
          })
          .finally(() => {
            setIsSaving(false);
          });
      } else {
        toast.error("Непредвиденная ситуация при сохранении");
        setIsSaving(true);
      }
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

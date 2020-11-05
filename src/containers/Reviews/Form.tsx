import { ReviewFormComponent } from "components/Reviews/Form";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getReviewById } from "utils/firebase";
import { IReviewItemModel } from "models/Review/interfaces";
import { UiGlobalLoader } from "components/UI/Loaders";

export const ReviewsForm = (): React.ReactElement => {
  const { id } = useParams<{ id?: string }>();

  const [createMode, setCreateMode] = useState(true);
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
    }
  }, [id]);

  console.log("--", loading, model, createMode);

  if (loading) {
    return <UiGlobalLoader />;
  }
  return <ReviewFormComponent model={model} createMode={createMode} />;
};

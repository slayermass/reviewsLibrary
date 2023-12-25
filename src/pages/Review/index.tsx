import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserType } from 'src/models/User';
import { reviewListPath } from 'src/routes/private';
import useGlobalStore from 'src/store';
import useReviewsStore from 'src/store/reviews';
import { API } from 'src/utils/apiDriver';
import { IReviewForm } from 'src/models/Review/interfaces';
import { UiGlobalLoader } from 'src/components/UI/Loaders';
import { ReviewFormComponent } from 'src/pages/Review/component';

export const ReviewsForm = (): React.ReactElement => {
  const { id } = useParams<{ id?: string }>();

  const user = useGlobalStore((state) => state.user.response as UserType);

  const { item, getItem, clearItem, updateItem, clearList } = useReviewsStore((state) => ({
    item: state.item,
    getItem: state.getItem,
    clearItem: state.clearItem,
    updateItem: state.updateItem,
    clearList: state.clearList,
  }));

  const navigate = useNavigate();

  useEffect(() => {
    getItem(id);

    return () => {
      clearItem();
    };
  }, [clearItem, getItem, id]);

  const [isSaving, setIsSaving] = useState(false);

  const checkIfDataExist = useCallback(
    (data: IReviewForm): Promise<boolean> =>
      new Promise<boolean>((resolve) => {
        API.checkReview(data).then((found) => {
          resolve(!found);
        });
      }),
    [],
  );

  const isAnonymousUser = user.email === null;

  const onSave = useCallback(
    (data: IReviewForm) => {
      if (isAnonymousUser) {
        toast.error('Недоступно для анонимных пользователей');
        return;
      }

      setIsSaving(true);

      new Promise((resolve) => {
        if (item.response === null) {
          checkIfDataExist(data).then((goFurther) => {
            if (goFurther) {
              resolve(API.createReview(data));
            } else {
              setIsSaving(false);

              toast.warning('Такая запись уже есть');
            }
          });
        } else if (id) {
          resolve(API.updateReview(id, data));
        } else {
          toast.error('Непредвиденная ситуация при сохранении');
          setIsSaving(false);
        }
      })
        .then(() => {
          if (id) {
            updateItem(id, data);
          } else {
            clearList(); // load again
          }

          toast.success('Успешно сохранено');

          navigate(reviewListPath);
        })
        .catch(toast.error);
    },
    [checkIfDataExist, clearList, id, isAnonymousUser, item.response, navigate, updateItem],
  );

  return item.loading ? (
    <UiGlobalLoader />
  ) : (
    <ReviewFormComponent
      model={item.response}
      onSave={onSave}
      isSaving={isSaving}
      canSave={!isAnonymousUser}
      userEmail={user.email}
    />
  );
};

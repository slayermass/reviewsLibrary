/* eslint-disable  */
import { ReviewItemModel } from 'src/models/Review';
import { IReviewForm, IReviewItemModel, IReviewModel, ReviewItemResponse } from 'src/models/Review/interfaces';
import { ReviewsListFilter } from 'src/store/reviews';
import { SafeAnyType } from 'src/utils/safeAny';
import { APIBaseInterface } from 'src/utils/dbBaseInterface';
import { httpGet, httpPost, httpPut } from 'src/utils/http';

export class DbMongo extends APIBaseInterface {
  checkAuth() {
    return httpGet('/me');
  }

  checkReview(model: IReviewForm): Promise<boolean> {
    return httpPost('/checkreview', model).then(({ found }: SafeAnyType) => found);
  }

  getReviewById(id: string): Promise<IReviewItemModel | null> {
    return httpGet(`/review/${id}`).then((response: SafeAnyType) => new ReviewItemModel(response));
  }

  login(email: string, password: string): Promise<string> {
    return httpPost('/login', { email, password });
  }

  subscribe(email: string) {
    throw new Error('no such method');
  }

  createReview(model: IReviewForm): Promise<{ id: string }> {
    return httpPost('/review', model);
  }

  updateReview(id: string, model: IReviewForm): Promise<IReviewItemModel> {
    return httpPut(`/review/${id}`, model);
  }

  getList(filter?: ReviewsListFilter): Promise<IReviewModel> {
    return httpGet<ReviewItemResponse>('/reviews', filter).then((response: SafeAnyType) => ({
      data: response.data.map((item: SafeAnyType) => new ReviewItemModel(item)),
      amount: response.amount,
    }));
  }
}

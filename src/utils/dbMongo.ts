/* eslint-disable  */
import { ReviewItemModel } from "models/Review";
import {
  IReviewForm,
  IReviewItemModel,
  IReviewModel,
  ReviewItemResponse,
  ReviewListFilterType,
} from "models/Review/interfaces";
import { APIBaseInterface } from "utils/dbBaseInterface";
import { httpGet, httpPost, httpPut } from "utils/http";


export class DbMongo extends APIBaseInterface {
  checkAuth() {
    return httpGet("/me");
  }

  checkReview(model: IReviewForm): Promise<{ found: boolean }> {
    return httpPost('/checkreview', model).then(({found}) => found);
  }

  getReviewById(id: string): Promise<IReviewItemModel | null> {
    return httpGet(`/review/${id}`).then(
      (response) => new ReviewItemModel(response)
    );
  }

  login(email: string, password: string): Promise<unknown> {
    return httpPost("/login", {email, password});
  }

  subscribe(email: string) {
    throw new Error("no such method");
  }

  createReview(model: IReviewForm): Promise<{ id: string }> {
    return httpPost("/review", model);
  }

  updateReview(id: string, model: IReviewForm): Promise<IReviewItemModel> {
    return httpPut(`/review/${id}`, model);
  }

  getList(filter?: ReviewListFilterType): Promise<IReviewModel> {
    return httpGet<ReviewItemResponse>("/reviews", filter).then((response) => ({
      data: response.data.map((item) => new ReviewItemModel(item)),
      amount: response.amount,
    }));
  }
}

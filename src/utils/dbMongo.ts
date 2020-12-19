/* eslint-disable */
import { IReviewForm, IReviewItemModel } from "models/Review/interfaces";
import { DbBaseInterface } from "utils/dbBaseInterface";

export class DbMongo extends DbBaseInterface {
  constructor() {
    super();

    this.db = "todo";
  }

  // eslint-disable-next-line class-methods-use-this
  getReviewById(id: string): Promise<IReviewItemModel | null> {
    return new Promise((resolve) => {
      resolve({
        album: "test album",
        comment: "test comment",
        date: new Date(),
        group: "test group",
        id: "6666666666666",
        rating: 1,
        author: "test author",
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  login(email: string, password: string): Promise<unknown> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line class-methods-use-this
  subscribe(email: string) {
    throw new Error("no such method");
  }

  // eslint-disable-next-line class-methods-use-this
  createReview(model: IReviewForm): Promise<void> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line class-methods-use-this
  updateReview(id: string, model: IReviewForm): Promise<void> {
    return Promise.resolve(undefined);
  }
}

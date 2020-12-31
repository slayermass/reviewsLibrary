import { IReviewItemModel } from "models/Review/interfaces";

export class ReviewItemModel implements IReviewItemModel {
  readonly album: string;
  readonly comment: string;
  readonly date: Date;
  readonly group: string;
  readonly id: string;
  readonly rating: number;
  readonly author: string;

  constructor(params: any = {}) {
    this.album = params.a;
    this.comment = params.c;
    this.date = new Date(params.d);
    this.group = params.g;
    // eslint-disable-next-line no-underscore-dangle
    this.id = params._id;
    this.rating = params.r;
    this.author = params.u;
  }
}

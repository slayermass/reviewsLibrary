import { IReviewItemModel } from "models/Review/interfaces";
import { CDate } from "utils/CDate";

export class ReviewItemModel implements IReviewItemModel {
  readonly album: string;
  readonly comment: string;
  readonly date: Date;
  readonly group: string;
  readonly id: string;
  readonly rating: number;

  constructor(params: any = {}) {
    this.album = params.album;
    this.comment = params.comment;
    this.date = CDate.fromUnixTime(params.date.seconds);
    this.group = params.group;
    this.id = params.id;
    this.rating = params.rating;
  }
}

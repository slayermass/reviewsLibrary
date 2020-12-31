export interface IReviewItemModel {
  readonly album: string;
  readonly comment: string;
  readonly date: Date;
  readonly group: string;
  readonly id: string;
  readonly rating: number; // 1-10
  readonly author: string; // почта пользователя
}

export type ReviewItemResponse = {
  data: {
    readonly a: string;
    readonly c: string;
    readonly d: Date;
    readonly g: string;
    readonly _id: string;
    readonly r: number;
    readonly u: string;
  }[];
  amount: number;
};

export type IReviewModel = { data: IReviewItemModel[]; amount: number };

export type IReviewForm = {
  readonly group: string;
  readonly album: string;
  readonly rating: number;
  readonly comment: string;
  readonly date: Date;
  readonly author: string;
};

export type ReviewListFilterType = { perPage: number; page: number };

export interface IReviewItemModel {
  readonly album: string;
  readonly comment: string;
  readonly date: Date;
  readonly group: string;
  readonly id: string;
  readonly rating: number; // 1-10
}

export type IReviewModel = IReviewItemModel[];

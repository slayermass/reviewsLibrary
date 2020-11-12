import { IReviewItemModel, IReviewModel } from "models/Review/interfaces";

export const comparatorDesc = (model: IReviewModel) => (
  prop: keyof IReviewItemModel
): IReviewModel =>
  model.sort((leftItem, rightItem) => {
    const leftValue = leftItem[prop];
    const rightValue = rightItem[prop];

    if (leftValue < rightValue) {
      return 1;
    }
    return leftValue > rightValue ? -1 : 0;
  });

export const comparatorAsc = (model: IReviewModel) => (
  prop: keyof IReviewItemModel
): IReviewModel =>
  model.sort((leftItem, rightItem) => {
    const leftValue = leftItem[prop];
    const rightValue = rightItem[prop];

    if (leftValue > rightValue) {
      return 1;
    }
    return leftValue < rightValue ? -1 : 0;
  });

export type ListSortType = "dateAsc" | "dateDesc" | "ratingAsc" | "ratingDesc";

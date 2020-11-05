import React from "react";
import { IReviewItemModel } from "models/Review/interfaces";

type Props = {
  model: IReviewItemModel | null;
  createMode: boolean;
};

export const ReviewFormComponent = ({ model, createMode }: Props) => {
  console.log(model, createMode);
  return <div>ReviewFormComponent</div>;
};

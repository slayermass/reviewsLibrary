import { IReviewForm, IReviewItemModel } from 'src/models/Review/interfaces';
import { ReviewsListFilter } from 'src/store/reviews';
import { SafeAnyType } from 'src/utils/safeAny';

export abstract class APIBaseInterface {
  /** авторизация. логин */
  abstract login(email: string, password: string): Promise<unknown>;

  /** проверка авторизованности */
  abstract checkAuth(): Promise<SafeAnyType>;

  /** обзоры. данные одного обзора */
  abstract getReviewById(id: string): Promise<IReviewItemModel | null>;

  /** обзоры. список. подписка */
  abstract subscribe(email: string): SafeAnyType;

  /** обзоры. создание */
  abstract createReview(model: IReviewForm): Promise<SafeAnyType>;

  /** обзоры. обновление */
  abstract updateReview(id: string, model: IReviewForm): Promise<SafeAnyType>;

  /** обзоры. список */
  abstract getList(filter: ReviewsListFilter): Promise<SafeAnyType>;
}

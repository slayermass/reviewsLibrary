import { toast } from 'react-toastify';
import { create } from 'zustand';

import { defaultSizePageTable } from 'src/config';
import { ListSortType } from 'src/models/Review/common';
import { IReviewForm, IReviewItemModel, IReviewModel } from 'src/models/Review/interfaces';
import { API } from 'src/utils/apiDriver';

/** MISC */
export type ReviewsListFilter = {
  perPage: number;
  page: number;
  group: string;
  album: string;
  comment: string;
  rating: number;
  sort: ListSortType;
};

/**
 * clean up empty params
 */
const cleanupFilter = (params: ReviewsListFilter): ReviewsListFilter =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (typeof value === 'string' && value.length === 0) {
        return false;
      }
      return !(typeof value === 'number' && value === 0);
    }),
  ) as ReviewsListFilter;
/** end MISC */

type Actions = {
  loadList: (filters: ReviewsListFilter) => void;
  getList: (filters?: ReviewsListFilter) => void;
  clearList: () => void;

  getItem: (id?: string) => void;
  clearItem: () => void;
  updateItem: (id: string, data: IReviewForm) => void;
};

type State = {
  list: { loading: boolean; response: IReviewModel };
  listFilter: ReviewsListFilter;

  item: { loading: boolean; response: IReviewItemModel | null };
};

const initialState: State = {
  list: { loading: false, response: { data: [], amount: 0 } },
  listFilter: {
    perPage: defaultSizePageTable,
    page: 1,
    group: '',
    album: '',
    comment: '',
    rating: 0,
    sort: 'dateDesc',
  },

  item: { loading: true, response: null },
};

const useReviewsStore = create<State & Actions>()((set, get) => ({
  ...initialState,

  getList: (filters) => {
    if (get().list.response.data.length === 0 && !get().list.loading) {
      get().loadList(filters || initialState.listFilter);
    }
  },
  clearList: () => {
    set({
      list: { ...initialState.list },
      listFilter: { ...initialState.listFilter },
    });
  },
  loadList: (filters) => {
    set((state) => ({
      listFilter: filters,
      list: {
        loading: true,
        response: state.list.response,
      },
    }));

    API.getList(cleanupFilter(filters))
      .then((response) => {
        set({
          list: {
            loading: false,
            response,
          },
        });
      })

      .catch((e) => {
        toast.error(e.toString());

        set({
          list: {
            loading: false,
            response: { ...initialState.list.response },
          },
        });
      });
  },

  getItem: (id) => {
    if (id) {
      set({
        item: { loading: true, response: null },
      });

      const found = get().list.response.data.find((item) => item.id === id);

      if (found) {
        set({
          item: { loading: false, response: found },
        });
      } else {
        API.getReviewById(id)
          .then((responseModel: IReviewItemModel | null) => {
            set({
              item: { loading: false, response: responseModel },
            });
          })
          .catch((e) => {
            set({
              item: { loading: false, response: null },
            });

            toast.error(e);
          });
      }
    } else {
      set({
        item: { loading: false, response: null },
      });
    }
  },
  clearItem: () => {
    set({
      item: { ...initialState.item },
    });
  },
  updateItem: (id, model) => {
    const foundIndex = get().list.response.data.findIndex((item) => item.id === id);

    if (~foundIndex) {
      set((state) => {
        const newData = [...state.list.response.data];

        newData[foundIndex] = {
          id,
          ...model,
        };

        return {
          list: {
            loading: false,
            response: {
              data: newData,
              amount: state.list.response.amount,
            },
          },
        };
      });
    }
  },
}));

export default useReviewsStore;

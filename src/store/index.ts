import { UserType } from 'src/models/User';
import { create } from 'zustand';

type Actions = {
  setUser: (data: State['user']) => void;
};

type State = {
  user: { loading: boolean; response: UserType | null };
};

const initialState: State = {
  user: { loading: true, response: null },
};

const useGlobalStore = create<State & Actions>()((set) => ({
  ...initialState,

  setUser: (data) => {
    set({ user: data });
  },
}));

export default useGlobalStore;

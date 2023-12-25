import { createContext } from 'react';
import { StateFormReturnType } from 'src/utils/stateForm/index';

export const StateFormContext = createContext<StateFormReturnType | null>(null);
StateFormContext.displayName = 'StateFormContext';

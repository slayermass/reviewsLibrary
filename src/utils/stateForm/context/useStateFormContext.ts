import { useContext } from 'react';
import { StateFormReturnType, StateFormUnknownFormType } from 'src/utils/stateForm/index';
import { StateFormContext } from 'src/utils/stateForm/context/index';
import { SafeAnyType } from 'src/utils/safeAny';

export const useStateFormContext = <
  FormValues extends StateFormUnknownFormType = SafeAnyType
>(): StateFormReturnType<FormValues> => useContext(StateFormContext) as StateFormReturnType<FormValues>;

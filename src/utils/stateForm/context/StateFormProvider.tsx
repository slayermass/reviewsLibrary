import { FC } from 'react';

import { ChildrenPropType } from 'src/utils/types';
import { StateFormReturnType } from 'src/utils/stateForm/index';
import { StateFormContext } from 'src/utils/stateForm/context/index';

type Props = {
  formProps: StateFormReturnType;
  children: ChildrenPropType;
};

export const StateFormProvider: FC<Props> = ({ formProps, children }) => (
  <StateFormContext.Provider value={formProps}>{children}</StateFormContext.Provider>
);

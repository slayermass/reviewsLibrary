import get from 'lodash/get';

import { SafeAnyType } from 'src/utils/safeAny';
import { StateFormFieldNamePathType, stateFormSubscriptions } from 'src/utils/stateForm/eventBus/common';

export const stateFormEmit = (fieldNamePath: StateFormFieldNamePathType, arg: SafeAnyType): void => {
  const subs = get(stateFormSubscriptions, fieldNamePath);

  if (!subs) {
    return;
  }

  Object.keys(subs).forEach((key) => subs[key] && subs[key](arg, fieldNamePath[2]));
};

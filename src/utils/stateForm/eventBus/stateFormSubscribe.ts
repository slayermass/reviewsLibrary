import set from 'lodash/set';
import unset from 'lodash/unset';
import get from 'lodash/get';

import { SafeAnyType } from 'src/utils/safeAny';
import { StateFormFieldNamePathType, stateFormSubscriptions } from 'src/utils/stateForm/eventBus/common';
import { getUniqueId } from 'src/utils/getUniqueId';

export const stateFormSubscribe = (
  fieldNamePath: StateFormFieldNamePathType,
  callback: (value: SafeAnyType, name: string) => void
): (() => void) => {
  const id = getUniqueId();
  const fieldNameIdPath = [...fieldNamePath, id];

  set(stateFormSubscriptions, fieldNameIdPath, callback);

  return () => {
    unset(stateFormSubscriptions, fieldNameIdPath);

    if (Object.keys(get(stateFormSubscriptions, fieldNamePath, {})).length < 1) {
      unset(stateFormSubscriptions, fieldNamePath);
    }
  };
};

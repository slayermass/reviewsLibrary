import unset from 'lodash/unset';
import { stateFormSubscriptions } from 'src/utils/stateForm/eventBus/common';

export const stateFormClearSubscriptions = (formId: string): boolean => unset(stateFormSubscriptions, formId);

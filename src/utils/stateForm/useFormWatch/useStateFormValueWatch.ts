import { SafeAnyType } from 'src/utils/safeAny';
import { useFormCommonWatch } from 'src/utils/stateForm/useFormWatch/index';
import { StateFormGetSubscribeProps, StateFormUnknownFormType } from 'src/utils/stateForm/index';
import { StateFormPath, StateFormPathValue, StateFormPathValues } from 'src/utils/stateForm/types/path';

export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: string | string[]
): ReturnValue;
export function useStateFormValueWatch<
  FormValues = Record<string, SafeAnyType>,
  Name extends StateFormPath<FormValues> = StateFormPath<FormValues>
>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: StateFormPath<FormValues>
): StateFormPathValue<FormValues, Name>;
export function useStateFormValueWatch<
  FormValues extends StateFormUnknownFormType = Record<string, SafeAnyType>,
  Names extends StateFormPath<FormValues>[] = StateFormPath<FormValues>[]
>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: StateFormPath<FormValues>[]
): StateFormPathValues<FormValues, Names>;
export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps
): ReturnValue;

/** the hook for subscribing to the input value change */
export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names?: string | string[]
): ReturnValue {
  return useFormCommonWatch<ReturnValue>(getSubscribeProps, 'change', names);
}

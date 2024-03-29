import { useFormCommonWatch } from 'src/utils/stateForm/useFormWatch/index';
import { StateFormGetSubscribeProps } from 'src/utils/stateForm/index';

type ErrorListType = { type: string; message: string }[];

export function useStateFormErrorWatch(getSubscribeProps: StateFormGetSubscribeProps, name: string): ErrorListType;

export function useStateFormErrorWatch(getSubscribeProps: StateFormGetSubscribeProps, name: string[]): ErrorListType[];

/** the hook for subscribing to the input errors change */
export function useStateFormErrorWatch(
  getSubscribeProps: StateFormGetSubscribeProps,
  name: string | string[]
): ErrorListType | ErrorListType[] {
  return useFormCommonWatch(getSubscribeProps, 'error', name) || [];
}

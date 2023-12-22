import { useEffect } from 'react';
import {
  StateFormFieldsType,
  StateFormGetSubscribeProps,
  StateFormRegister,
  StateFormRegisterOptions,
  StateFormUnregister,
} from 'src/utils/stateForm';
import { SafeAnyType } from 'src/utils/safeAny';
import { useStateFormValueWatch } from 'src/utils/stateForm/useFormWatch/useStateFormValueWatch';
import { useStateFormErrorWatch } from 'src/utils/stateForm/useFormWatch/useStateFormErrorWatch';

type Props = {
  getSubscribeProps: StateFormGetSubscribeProps;
  name: string;
  register: StateFormRegister;
  unregister: StateFormUnregister;
  type: StateFormFieldsType;

  inputOptions?: StateFormRegisterOptions;
  validateName?: string; // won't be unregistered. Use for response validation
};

export const useInputBaseHook = <ReturnValue = SafeAnyType>({
  getSubscribeProps,
  name,
  inputOptions,
  register,
  unregister,
  type,
  validateName,
}: Props): [ReturnValue, { type: string; message: string }[]] => {
  useEffect(() => {
    register(name, type, inputOptions);
  }, [inputOptions, name, register, type]);

  useEffect(() => () => unregister(name), [name, unregister]);

  const value = useStateFormValueWatch(getSubscribeProps, name);
  const errors = useStateFormErrorWatch(getSubscribeProps, validateName ? [name, validateName] : [name]);

  return [value, errors.flat()];
};

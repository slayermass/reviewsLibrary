import merge from 'lodash/merge';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import set from 'lodash/set';
import isPlainObject from 'lodash/isPlainObject';
import has from 'lodash/has';
import equal from 'fast-deep-equal';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import { diff } from 'deep-object-diff';

import { SyntheticEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { SafeAnyType } from 'src/utils/safeAny';
import { stateFormEmit } from 'src/utils/stateForm/eventBus/stateFormEmit';
import { stateFormClearSubscriptions } from 'src/utils/stateForm/eventBus/stateFormClearSubscriptions';
import { getUniqueId } from 'src/utils/getUniqueId';
import { stateFormSubscribe } from 'src/utils/stateForm/eventBus/stateFormSubscribe';
import { StateFormEventType } from 'src/utils/stateForm/eventBus/common';
import { formStateGenerateErrors } from 'src/utils/stateForm/helpers/formStateGenerateErrors';
import { StateFormPath, StateFormPathValue, StateFormPathValues } from 'src/utils/stateForm/types/path';
import { DeepPartial } from 'src/utils/types';

type ErrorsType = { type: StateFormErrorTypes; message: string; initChange?: boolean }[] | null | undefined;

type DefinedErrorsType = NonNullable<ErrorsType>;

type FieldOptionValue = {
  type: StateFormFieldsType;
  active: boolean;
  options: StateFormInputOptionsType;
  isDirty: boolean;
  ref?: HTMLElement | null;
};

type FieldsOptions = Record<string, FieldOptionValue>;

/**
 * error type may be any string but these are default types which are used in the form
 *
 * validate - for default validation errors (required ...)
 * hover    - only for hover errors
 */
type StateFormErrorTypes = 'hover' | 'validate' | 'all' | string;

/** --- return types --- */
export type StateFormPossibleValue = string | number | boolean | null | undefined | [string, string];

export type StateFormErrors = { [s: string]: DefinedErrorsType };

export type StateFormOnSubmitType<FormValues> = (
  right: (d: FormValues, status: StateFormGetStatusValue) => void,
  left?: (e: StateFormErrors) => void,
) => (e?: SyntheticEvent) => void;

export type StateFormInputOptionsType = {
  required?: boolean;

  initChange?: true; // creates errors for every input when started; inner usage

  minLength?: number;
  maxLength?: number;

  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  // true is OK, false is a validate error; string is a custom error
  validate?: (value: StateFormPossibleValue) => boolean | string;
  changedInitialValue?: (value: StateFormPossibleValue) => StateFormPossibleValue;
  errorLabel?: string;

  doEmailValidation?: boolean; // only for type="email"

  trigger?: boolean;
};

export type StateFormOnChange = (
  name: string,
  value: StateFormPossibleValue,
  options?: StateFormSetValueOptions,
) => void;

export type StateFormOnBlur = (name: string, options?: StateFormInputOptionsType) => void;

export type StateFormUnknownFormType = Record<SafeAnyType, SafeAnyType>;

export type StateFormGetErrorsByName<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): DefinedErrorsType;
  <FieldNames extends StateFormPath<FormValues>[]>(fieldNames: FieldNames): DefinedErrorsType[];
};

export type StateFormInnerGetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  property: FieldName,
) => StateFormPathValue<FormValues, FieldName>;

export type StateFormGetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (): FormValues;
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): StateFormPathValue<FormValues, FieldName>;
  <FieldNames extends StateFormPath<FormValues>[]>(
    fieldNames: [...FieldNames],
  ): [...StateFormPathValues<FormValues, FieldNames>];
};

export type StateFormTrigger<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (): void;
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): void;
  <FieldNames extends StateFormPath<FormValues>[]>(fieldNames: FieldNames): void;
};

export type StateFormClearTypes = (name: string, type?: StateFormErrorTypes) => void;

export type StateFormSetError<FormValues extends StateFormUnknownFormType = SafeAnyType> = (
  name: StateFormPath<FormValues>,
  error: DefinedErrorsType[0] | string,
  initChange?: boolean,
) => void;

type StateFormSetValueOptions = {
  trigger?: boolean;
  merge?: boolean;
  _afterRegister?: boolean;
};
type StateFormSetMultipleValueOptions = StateFormSetValueOptions & {
  prefix?: string;
};

export type StateFormSetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (
    name: StateFormPath<FormValues>,
    value: StateFormPathValue<FormValues, StateFormPath<FormValues>> | StateFormPossibleValue,
    options?: StateFormSetValueOptions,
  ): void;
  (
    values: Partial<
      Record<
        StateFormPath<FormValues>,
        StateFormPathValue<FormValues, StateFormPath<FormValues>> | StateFormPossibleValue
      >
    >,
    options?: StateFormSetMultipleValueOptions,
  ): void;
};

export type StateFormRegisterOptions = Omit<StateFormInputOptionsType, 'initChange'>;

export type StateFormRegister = (name: string, type: StateFormFieldsType, options?: StateFormRegisterOptions) => void;

export type StateFormUnregister = (name: string) => void;

export type StateFormSubscribeFn = (
  callback: (value: SafeAnyType, fieldName: string) => void,
) => ReturnType<typeof stateFormSubscribe>[];

// TODO: make dependent on eventType prop
type StateFormSubscribeDefaultValue = SafeAnyType;

export type StateFormGetSubscribeProps = (
  eventType: StateFormEventType,
  names?: string | string[],
) => [StateFormSubscribeFn, StateFormSubscribeDefaultValue];

export type StateFormFieldsType =
  | 'checkbox'
  | 'checkboxGroup' // it only marks as this, but must not be used directly
  | 'text'
  | 'password'
  | 'email'
  | 'textarea'
  | 'radio'
  | 'color'
  | 'dropdown'
  | 'masked'
  | 'number'
  | 'image'
  | 'datepicker'
  | 'rangeDatepicker'
  | 'timepicker'
  | 'wysiwyg'
  | 'phone'
  | 'switch'
  | 'buttonCheckbox'
  | 'file'
  | 'tags';

export type StateFormReset<FormValues = SafeAnyType> = (
  values?: DeepPartial<FormValues>,
  options?: { trigger?: boolean; resetInitialForm?: boolean },
) => void;

export type StateFormSetRef = (name: string) => (element: HTMLElement | null) => void;

export type StateFormGetDirtyFields = () => string[];

export type StateFormGetStatusValue = { isDirty: boolean };
export type StateFormGetStatus = () => StateFormGetStatusValue;

export type StateFormChangeStateDirectly = (name: string, value: SafeAnyType) => void;

export type StateFormSetFocus<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  fieldName: FieldName,
) => void;
/** --- end return types --- */

export type StateFormReturnType<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  onSubmit: StateFormOnSubmitType<FormValues>;
  onChange: StateFormOnChange;
  onBlur: StateFormOnBlur;
  clearErrors: StateFormClearTypes;
  getErrors: StateFormGetErrorsByName<FormValues>;
  getValue: StateFormGetValue<FormValues>;
  setValue: StateFormSetValue<FormValues>;
  setError: StateFormSetError<FormValues>;
  register: StateFormRegister;
  unregister: StateFormUnregister;
  getSubscribeProps: StateFormGetSubscribeProps;
  reset: StateFormReset<FormValues>;
  getDirtyFields: StateFormGetDirtyFields;
  getStatus: StateFormGetStatus;
  changeStateDirectly: StateFormChangeStateDirectly;
  trigger: StateFormTrigger<FormValues>;
  setFocus: StateFormSetFocus<FormValues>;
  setRef: StateFormSetRef;
  getInitialValue: StateFormGetValue<FormValues>;
};

export const useStateForm = <FormValues extends StateFormUnknownFormType>({
  defaultValues,
  mode = 'onBlur',
  onAnyValueChanged,
}: {
  defaultValues?: DeepPartial<FormValues>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  onAnyValueChanged?: (data: FormValues) => void;
} = {}): StateFormReturnType<FormValues> => {
  const initialValues = useRef(defaultValues || ({} as FormValues));

  const cloneDeep: <R>(value: R) => R = useCallback((value) => {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return value;
    }
  }, []);

  /** form data storage */
  const formState = useRef<FormValues>(cloneDeep(initialValues.current as FormValues));

  /** form errors storage */
  const errors = useRef<StateFormErrors>({});

  /** form fields options */
  const fieldsOptions = useRef<FieldsOptions>({});

  /** form unique id */
  const id = useRef(getUniqueId()).current;

  /** helpers */
  const getErrorsByNameInner = useCallback((name: string) => (errors.current[name] || []) as DefinedErrorsType, []);

  const hasErrorsByName = useCallback(
    (name: string, type: StateFormErrorTypes = 'all'): boolean => {
      let errors = getErrorsByNameInner(name);

      if (type !== 'all') {
        errors = errors.filter((item) => item.type === type);
      }

      return errors.length > 0;
    },
    [getErrorsByNameInner],
  );

  const getFieldOptionsValue: <PROP extends keyof FieldOptionValue>(
    name: string,
    prop: PROP,
  ) => FieldOptionValue[PROP] = useCallback(
    (name, prop) => get(fieldsOptions.current[name], `[${prop}]`) as SafeAnyType,
    [],
  );

  const getAllValues = useCallback(
    () =>
      Object.entries(formState.current)
        .filter(([name]) => getFieldOptionsValue(name, 'type') !== 'checkboxGroup')
        .reduce<SafeAnyType>((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {}),
    [getFieldOptionsValue],
  );

  const setFieldOptionsValue = useCallback(
    (
      fieldName: string,
      options: Partial<FieldOptionValue> | FieldOptionValue[keyof FieldOptionValue],
      propName?: keyof FieldOptionValue,
    ): void => {
      fieldsOptions.current[fieldName] = propName
        ? { ...fieldsOptions.current[fieldName], [propName]: options }
        : (options as FieldOptionValue);
    },
    [],
  );

  const checkDirtyField = useCallback(
    (name: string) => !equal(get(initialValues.current, name), get(formState.current, name)),
    [],
  );

  const innerGetValue: StateFormInnerGetValue = useCallback(
    (name) => cloneDeep(get(formState.current, name)),
    [cloneDeep],
  );

  const setRef: StateFormSetRef = useCallback(
    (name) => (element) => {
      const ref = getFieldOptionsValue(name, 'ref');

      if ((!ref && element) || (ref && !element)) {
        setFieldOptionsValue(name, element, 'ref');
      }
    },
    [getFieldOptionsValue, setFieldOptionsValue],
  );

  const previousFormState = useRef<FormValues>(cloneDeep(initialValues.current as FormValues));

  const changeStateForm = useCallback(
    (name: string, value: SafeAnyType) => {
      set(formState.current, name, value);

      const diffStateValue = diff(previousFormState.current, formState.current);

      if (!isEmpty(diffStateValue)) {
        const cloneObjOrArray = (value: SafeAnyType) =>
          isPlainObject(value) || isArray(value) ? cloneDeep(value) : value;

        set(previousFormState.current, name, cloneObjOrArray(value));

        const getNames = (value: StateFormUnknownFormType, parentName?: string): string[] => {
          if (isPlainObject(value)) {
            return Object.entries(value).reduce<string[]>(
              (acc, [propName, propValue]) => {
                const name = parentName ? `${parentName}.${propName}` : propName;

                /* there are two ways to subscribe to array values.
                 * arrayProp.0 and arrayProp[0]
                 */
                const arrName = /^\d+$/.test(propName) ? `${parentName}[${propName}]` : undefined;

                return arrName
                  ? [...getNames(propValue, arrName), ...getNames(propValue, name), ...acc]
                  : [...getNames(propValue, name), ...acc];
              },
              isPlainObject(value) && parentName ? [parentName] : [],
            );
          }

          return parentName ? [parentName] : [];
        };

        getNames(diffStateValue).forEach((name) => {
          stateFormEmit([id, 'change', name], cloneObjOrArray(get(formState.current, name)));
        });

        stateFormEmit([id, 'change', id], cloneObjOrArray(formState.current));
      }
    },
    [cloneDeep, id],
  );
  /** end helpers */

  /** outer API */
  const getValue = useCallback(
    (names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      if (!names) {
        return getAllValues();
      }

      if (isString(names)) {
        return innerGetValue(names);
      }

      if (isArray(names)) {
        return names.map((name) => innerGetValue(name));
      }

      return undefined;
    },
    [getAllValues, innerGetValue],
  ) as StateFormGetValue<FormValues>;

  const getErrors = useCallback(
    (names: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      if (isString(names)) {
        return getErrorsByNameInner(names).filter(({ initChange }) => !initChange);
      }

      if (isArray(names)) {
        return names.map((name) => getErrorsByNameInner(name).filter(({ initChange }) => !initChange));
      }

      return [];
    },
    [getErrorsByNameInner],
  ) as StateFormGetErrorsByName<FormValues>;

  const emitErrors = useCallback(
    (name: string, customErrors?: DefinedErrorsType) =>
      stateFormEmit([id, 'error', name], customErrors || getErrors(name as StateFormPath<FormValues>)),
    [getErrors, id],
  );

  const setError: StateFormSetError<FormValues> = useCallback(
    (name, error, initChange) => {
      const foundErrors = cloneDeep(getErrorsByNameInner(name));

      if (typeof error === 'string') {
        const errObj: DefinedErrorsType[0] = {
          type: 'validate',
          message: error,
        };

        if (initChange) {
          errObj.initChange = true;
        }

        foundErrors.push(errObj);
      } else {
        if (initChange) {
          error.initChange = true;
        }

        /**
         * in case of setting the same error multiple times (required by form and setting requierment manually)
         * prefer 'validate' type rather than 'hover' or any custom
         * */
        if (!foundErrors.find(({ message }) => message === error.message)) {
          foundErrors.push(error);
        }
      }

      errors.current[name] = foundErrors;

      emitErrors(name);
    },
    [cloneDeep, emitErrors, getErrorsByNameInner],
  );

  const clearErrors: StateFormClearTypes = useCallback(
    (name, type = 'all') => {
      const foundErrors = getErrorsByNameInner(name);

      let newErrors: DefinedErrorsType = [];

      if (type !== 'all') {
        newErrors = cloneDeep(foundErrors).filter((err) => err.type !== type);
      }

      if (foundErrors.length !== newErrors.length) {
        if (newErrors.length) {
          errors.current[name] = newErrors;
        } else {
          delete errors.current[name];
        }

        emitErrors(name);
      }
    },
    [cloneDeep, emitErrors, getErrorsByNameInner],
  );

  const validateInput = useCallback(
    (name: string, method: typeof mode, needTrigger = false, clearOnlyValidateError = false) => {
      const value = innerGetValue(name);

      const type = getFieldOptionsValue(name, 'type');

      const omitArrayTypes: StateFormFieldsType[] = ['rangeDatepicker', 'file', 'tags'];

      if (isArray(value) && !omitArrayTypes.includes(type)) {
        (value as Record<string, StateFormPossibleValue>[]).forEach((item, index) => {
          if (isPlainObject()) {
            Object.keys(item).forEach((key) => {
              validateInput(`${name}[${index}].${key}`, method, true, clearOnlyValidateError);
            });
          } else {
            // primitive arrays are not commonly used
            value.forEach((_, innerIndex) => {
              validateInput(`${name}[${index}][${innerIndex}]`, method, true, clearOnlyValidateError);
            });
          }
        });
      } else {
        /** declare variables */
        const fieldType = getFieldOptionsValue(name, 'type');

        const fieldsAlwaysNeedCheck: StateFormFieldsType[] = [];

        // const fieldsAlwaysNeedCheck: StateFormFieldsType[] =
        //   mode === 'onSubmit' ? [] : ['checkbox', 'timepicker', 'datepicker'];

        const options = getFieldOptionsValue(name, 'options');

        const initialChange: boolean = options?.initChange === true;

        const isCurrentMode = method === mode;
        /** end declare variables */

        if (
          (!initialChange || isCurrentMode || needTrigger) &&
          hasErrorsByName(name, 'validate') &&
          fieldType !== 'phone' // it has its own errors
        ) {
          clearErrors(name, clearOnlyValidateError ? 'validate' : 'all');
        }

        if (isCurrentMode || initialChange || needTrigger || fieldsAlwaysNeedCheck.includes(fieldType)) {
          formStateGenerateErrors(value, options, fieldType, name).forEach((errorMessage) => {
            setError(
              name as StateFormPath<FormValues>,
              errorMessage,
              needTrigger || isCurrentMode ? false : initialChange,
            );
          });
        }
      }
    },
    [clearErrors, getFieldOptionsValue, innerGetValue, hasErrorsByName, mode, setError],
  );

  const changeStateDirectly: StateFormChangeStateDirectly = useCallback(
    (name, value) => {
      changeStateForm(name, cloneDeep(value));

      validateInput(name, 'onChange', true);
    },
    [changeStateForm, cloneDeep, validateInput],
  );

  const onAnyValueChangedLocal = useRef(() => {
    onAnyValueChanged?.(getValue());
  });

  const onChange: StateFormOnChange = useCallback(
    (name, value, options) => {
      const newValue = options?.merge === true ? cloneDeep(merge(get(formState.current, name), value)) : value;

      changeStateForm(name, newValue);

      setFieldOptionsValue(
        name,
        {
          ...getFieldOptionsValue(name, 'options'),
          initChange: undefined,
        },
        'options',
      );

      setFieldOptionsValue(name, checkDirtyField(name), 'isDirty');

      onAnyValueChangedLocal.current();

      // prevent checkboxes show errors immediately after registering
      if (
        !(
          // eslint-disable-next-line no-underscore-dangle
          (options?._afterRegister && fieldsOptions.current[name].type === 'checkbox')
        )
      ) {
        validateInput(name, 'onChange', options?.trigger);
      }
    },
    [changeStateForm, checkDirtyField, cloneDeep, getFieldOptionsValue, setFieldOptionsValue, validateInput],
  );

  const onBlur: StateFormOnBlur = useCallback(
    (name) => {
      validateInput(name, 'onBlur', true);
    },
    [validateInput],
  );

  const setValue: StateFormSetValue<FormValues> = useCallback(
    (...args) => {
      const changeFn = (name: string, value: SafeAnyType, options?: StateFormSetMultipleValueOptions) => {
        onChange(options?.prefix ? `${options.prefix}.${name}` : name, value, {
          trigger: !(options?.trigger === false || options?.trigger === undefined),
          merge: options?.merge,
        });
      };

      if (isPlainObject(args[0])) {
        Object.entries(args[0]).forEach(([name, value]) => changeFn(name, value, args[1] as StateFormSetValueOptions));
      } else {
        changeFn(args[0] as string, args[1], args[2] as StateFormSetValueOptions);
      }
    },
    [onChange],
  );

  const register: StateFormRegister = useCallback(
    (name, fieldType, options = {}) => {
      const fieldOptions = getFieldOptionsValue(name, 'options');
      const fieldRef = getFieldOptionsValue(name, 'ref');

      setFieldOptionsValue(name, {
        type: fieldType,
        active: true,
        options: {
          ...fieldOptions,
          initChange: fieldOptions ? undefined : true,
          ...options,
        },
        ref: fieldRef,
      });

      let value = innerGetValue(name);

      if (isFunction(options.changedInitialValue)) {
        value = options.changedInitialValue(value);
      }

      if (!has(initialValues.current, name)) {
        set(initialValues.current, name, fieldType === 'checkbox' ? !!value : value);
      }

      /** set the current value whatever it may be to have all the values registered */
      onChange(name, value, { _afterRegister: true });
    },
    [getFieldOptionsValue, innerGetValue, onChange, setFieldOptionsValue],
  );

  const unregister: StateFormUnregister = useCallback(
    (name) => {
      setFieldOptionsValue(name, false, 'active');
      setFieldOptionsValue(name, false, 'isDirty');
      clearErrors(name);
    },
    [clearErrors, setFieldOptionsValue],
  );

  const trigger: StateFormTrigger<FormValues> = useCallback(
    (names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      let fields: string[] = [];

      if (!names) {
        fields = Object.entries(fieldsOptions.current)
          .filter(([name]) => getFieldOptionsValue(name, 'type') !== 'checkboxGroup')
          .filter(([, item]) => item.active)
          .map(([key]) => key);
      }

      if (isString(names)) {
        fields = [names];
      }

      if (isArray(names)) {
        fields = names;
      }

      /** trigger all values but only by validate type */
      fields.forEach((name) => {
        validateInput(name, 'onSubmit', true, true);
      });
    },
    [getFieldOptionsValue, validateInput],
  );

  const setFocus: StateFormSetFocus<FormValues> = useCallback(
    (name) => {
      const ref = getFieldOptionsValue(name, 'ref');

      if (ref && ref.focus) {
        ref.focus();
      }
    },
    [getFieldOptionsValue],
  );

  const getStatus: StateFormGetStatus = useCallback(
    () => ({
      isDirty: Object.values(fieldsOptions.current).some((value) => value.isDirty),
    }),
    [],
  );

  const onSubmit: StateFormOnSubmitType<FormValues> = useCallback(
    (right, left) => (e) => {
      e?.preventDefault();

      /**
       * there can be any errors even not connected to form directly
       * reset all error and wait if trigger generates local ones
       */
      errors.current = {};

      trigger();

      const foundErrors = errors.current;

      if (isEmpty(foundErrors)) {
        right(getAllValues(), getStatus());
      } else if (isFunction(left)) {
        left(foundErrors);
      }
    },
    [getAllValues, getStatus, trigger],
  );

  const reset: StateFormReset = useCallback(
    (values, options) => {
      const fn = (obj: StateFormUnknownFormType, path?: string) =>
        Object.entries(obj).forEach(([key, currentValue]) => {
          const name = path ? `${path}.${key}` : key;

          if (isPlainObject(currentValue)) {
            fn(currentValue, name);
          } else {
            let value = get(values || initialValues.current, name);

            if (value === undefined) {
              switch (fieldsOptions.current[name]?.type) {
                case 'checkbox': {
                  value = false;
                  break;
                }
                case 'masked': {
                  value = '';
                  break;
                }
                default:
                  break;
              }
            }

            changeStateForm(name, value);

            setFieldOptionsValue(
              name,
              {
                ...getFieldOptionsValue(name, 'options'),
                initChange: true,
              },
              'options',
            );
            setFieldOptionsValue(name, false, 'isDirty');

            clearErrors(name);

            if (options?.trigger) {
              validateInput(name, 'onChange', true);
            }
          }
        });

      fn(values || formState.current);

      if (options?.resetInitialForm && values) {
        initialValues.current = cloneDeep(values);
      }
    },
    [changeStateForm, clearErrors, cloneDeep, getFieldOptionsValue, setFieldOptionsValue, validateInput],
  );

  const getDirtyFields: StateFormGetDirtyFields = useCallback(
    () =>
      Object.entries(fieldsOptions.current)
        .filter(([name]) => getFieldOptionsValue(name, 'type') !== 'checkboxGroup')
        .filter(([, value]) => value.isDirty)
        .map(([key]) => key),
    [getFieldOptionsValue],
  );
  /** end outer API */

  /** state subscription */

  const getSubscribeProps: StateFormGetSubscribeProps = useCallback(
    (eventType, names) => [
      (callback: (value: SafeAnyType, fieldName: string) => void) => {
        /* callback when subscribed to all form values */
        if (!names) {
          return [stateFormSubscribe([id, eventType, id], callback)];
        }

        return isString(names)
          ? [stateFormSubscribe([id, eventType, names], callback)]
          : names.map((name) => stateFormSubscribe([id, eventType, name], callback));
      },
      eventType === 'change' ? getValue(names as SafeAnyType) : getErrors(names as SafeAnyType),
    ],
    [getErrors, getValue, id],
  );

  /** clear all subscriptions current form */
  useEffect(
    () => () => {
      stateFormClearSubscriptions(id);
    },
    [id],
  );
  /** end state subscription */

  /** get initial value of the form */
  const getInitialValue = useCallback(
    (names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      const getAllValues = () =>
        Object.entries(initialValues.current)
          .filter(([name]) => getFieldOptionsValue(name, 'type') !== 'checkboxGroup')
          .reduce<SafeAnyType>((acc, [k, v]) => {
            acc[k] = v;
            return acc;
          }, {});

      const innerGetValue: StateFormInnerGetValue = (name) => cloneDeep(get(initialValues.current, name));

      if (!names) {
        return getAllValues();
      }

      if (isString(names)) {
        return innerGetValue(names);
      }

      if (isArray(names)) {
        return names.map((name) => innerGetValue(name));
      }

      return undefined;
    },
    [cloneDeep, getFieldOptionsValue],
  ) as StateFormGetValue<FormValues>;

  return useMemo(
    () => ({
      onSubmit,

      onChange,
      onBlur,

      clearErrors,

      getErrors,
      getValue,

      setError,
      setValue,
      setRef,

      register,
      unregister,

      getSubscribeProps,

      reset,

      getDirtyFields,
      getStatus,

      changeStateDirectly,

      trigger,
      setFocus,

      getInitialValue,
    }),
    [
      onSubmit,
      onChange,
      onBlur,
      clearErrors,
      getErrors,
      getValue,
      setError,
      setValue,
      setRef,
      register,
      unregister,
      getSubscribeProps,
      reset,
      getDirtyFields,
      getStatus,
      changeStateDirectly,
      trigger,
      setFocus,
      getInitialValue,
    ],
  );
};

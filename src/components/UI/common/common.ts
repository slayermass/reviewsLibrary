import { numberOrDefaultNumber } from 'src/utils/numbers';

export const getInputMaxLength = (max?: number): number => numberOrDefaultNumber(max, 300);

export const calcInputSelection = (selectionStart: number, value: string): number =>
  value[selectionStart - 1] === ' ' && value[selectionStart - 2] === ' ' ? selectionStart - 1 : selectionStart;

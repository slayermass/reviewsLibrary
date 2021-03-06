import React, { ChangeEvent } from "react";
import styled from "styled-components";

const Label = styled.label`
  top: 0;
  left: 0;
  position: absolute;
  color: #0000008a;

  transform: translate(0, -10px) scale(0.75);
  transform-origin: top left;
`;

const Select = styled.select`
  border: none;
  background: white;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 38px;

  width: 100%;
  border: 0;
  padding: 2px 0;
  background: white no-repeat;
  background-image: linear-gradient(to bottom, #212b6e, #212b6e),
    linear-gradient(to bottom, #fafafa, #8c9094);
  background-size: 0 2px, 100% 1px;
  background-position: 50% 100%, 50% 100%;
  transition: background-size 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
  outline: none;

  &:hover {
    background-size: 100% 2px, 100% 1px;
    outline: none;
    transition: none;
    background-image: linear-gradient(to bottom, #000000de, #000000de),
      linear-gradient(to bottom, #000000de, #000000de);
  }
`;

export type SelectOptionType = {
  label: string;
  value: string | number;
};

export type SelectOptionsType = SelectOptionType[];

type Props = {
  label: string;
  onChange: (v: string | number) => void;
  options: SelectOptionsType;
};

export const UiSelect = ({
  onChange,
  options,
  label,
}: Props): React.ReactElement => {
  const id = Math.random().toString();

  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      <Select
        onChange={({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
          onChange(value);
        }}
        defaultValue={options[0].value}
      >
        {options.map(({ value, label: option }) => (
          <option value={value} key={`${value}${option}`}>
            {option}
          </option>
        ))}
      </Select>
    </Wrapper>
  );
};

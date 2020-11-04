import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";

import { SvgRemove } from "assets/svg/remove";

const Label = styled.label<{ active: boolean }>`
  transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  top: 0;
  left: 0;
  position: absolute;
  color: #0000008a;

  ${(p) =>
    p.active
      ? "transform: translate(0, -10px) scale(0.75);transform-origin: top left;color: #303f9f;"
      : "transform: translate(0, 11px) scale(1);"}
`;

const Wrapper = styled.div<{ active: boolean }>`
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

  &:hover {
    background-size: 100% 2px, 100% 1px;
    outline: none;
    transition: none;
    background-image: linear-gradient(to bottom, #000000de, #000000de),
      linear-gradient(to bottom, #000000de, #000000de);
  }

  ${(p) =>
    p.active &&
    `
    background-size: 100% 2px, 100% 1px;
    outline: none;
    background-image: linear-gradient(to bottom, #3f51b5, #3f51b5),
      linear-gradient(to bottom, #fafafa, #e0e0e0) !important;
  `}
`;

const Input = styled.input`
  display: block;
  width: 100%;
  border: 0;
  padding: 10px 0;
  background: white no-repeat;

  outline: none;
`;

// todo базовая кнопка svg
const ClearButton = styled.button`
  position: relative;
  top: -3px;

  cursor: pointer;
  background: transparent;
  border: none;
  flex: 0 0 auto;
  color: rgba(0, 0, 0, 0.54);
  padding: 12px;
  overflow: visible;
  font-size: 1.5rem;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  width: 48px;
  height: 48px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  &:focus {
    outline: none;
  }
  &:active {
    svg path {
      fill: #31373c;
    }
  }

  svg {
    path {
      fill: rgba(0, 0, 0, 0.54);
    }
    width: 24px;
    height: 24px;
  }
`;

type Props = {
  label: string;
  onChange: (v: any) => void;

  type?: "text";
};

export const UiInput = memo(
  ({ label, onChange, type = "text" }: Props): React.ReactElement => {
    const [localValue, setLocalValue] = useState<string>("");

    const id = Math.random().toString();

    useEffect(() => {
      onChange(localValue);
    }, [localValue]);

    const [focus, setFocus] = useState(false);
    const onFocus = () => setFocus(true);
    const onBlur = () => setFocus(false);
    const onClear = () => {
      setLocalValue("");
    };

    const isActive = focus || localValue.length > 0;

    return (
      <Wrapper active={isActive}>
        <Label htmlFor={id} active={isActive}>
          {label}
        </Label>
        <Input
          type={type}
          id={id}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={({ target: { value } }) =>
            setLocalValue(value.replace(/\s\s+/g, " ").replace(/^\s/, ""))
          }
          value={localValue}
        />
        <ClearButton onClick={onClear}>
          <SvgRemove />
        </ClearButton>
      </Wrapper>
    );
  }
);

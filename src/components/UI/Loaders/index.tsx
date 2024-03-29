import React, { memo } from 'react';
import styled from 'styled-components';

const WrapLoader = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.33);
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;

  &:after {
    content: ' ';
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 5px solid ${(p) => (p.color ? p.color : '#fff')};
    border-color: ${(p) => (p.color ? p.color : '#fff')} transparent ${(p) => (p.color ? p.color : '#fff')} transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

type Props = {
  color?: string;
};

export const UiLoader = memo(({ color }: Props): React.ReactElement => <Loader color={color} />);

export const UiGlobalLoader = memo(
  ({ color }: Props): React.ReactElement => (
    <WrapLoader>
      <UiLoader color={color} />
    </WrapLoader>
  ),
);

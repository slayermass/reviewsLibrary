import styled from 'styled-components';

export const StyledHeader = styled.h1`
  font-weight: 500;
  background-color: #f5f8fa;
  color: #31373c;
  z-index: 1100;
  position: fixed;
  height: 64px;
  margin: 0;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 36px;
  margin-top: -4px;

  @media (max-width: 400px) {
    & {
      font-size: 28px;
    }
  }

  @media (max-width: 900px) {
    & {
      text-align: center;
    }
  }
`;

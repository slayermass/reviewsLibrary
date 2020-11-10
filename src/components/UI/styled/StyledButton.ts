import styled from "styled-components";

export const StyledButton = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  min-width: 64px;
  box-sizing: border-box;
  min-height: 36px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  border-radius: 4px;
  text-transform: uppercase;
  border: 0;
  background-color: white;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  outline: none;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;

  svg {
    path {
      fill: #fff;
    }
  }

  &[disabled] {
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.26);
    cursor: default;
    pointer-events: none;
  }
`;

export const StyledPrimaryButton = styled(StyledButton)`
  background-color: #3f51b5;
  color: #fff;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #303f9f;
  }
`;

import styled from "styled-components";

export const StyledButtonLoader = styled.div`
  padding: 4px 0px;

  &:after {
    content: " ";
    display: block;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    border: 3px solid #fff;
    border-color: #fff transparent #fff transparent;
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

import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  display: block;
  background-image: -webkit-linear-gradient(top, #6eb6de, #4a77d4);
  background-color: #4a77d4;
  background-repeat: repeat-x;
  border: 1px solid #3762bc;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 15px;
  line-height: normal;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;

  &:hover {
    filter: none;
    background-color: #4a77d4;
    transition: background-position 0.1s linear;
    border: 1px solid #3762bc;
    background-position: 0 -15px;
  }

  span {
    padding: 9px 0;
  }
`;
const Loader = styled.div`
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

type Props = {
  loading: boolean;
  text?: string;
  type?: "submit" | "button";
};

export const LoaderButton = ({
  loading,
  type = "button",
  text = "Войти",
}: Props): React.ReactElement => (
  <Button type={type} disabled={loading}>
    {loading ? <Loader /> : <span>{text}</span>}
  </Button>
);

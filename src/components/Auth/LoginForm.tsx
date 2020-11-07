import { StyledButtonLoader } from "components/UI/styled/StyledButtonLoader";
import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  font-family: "Open Sans", sans-serif;
  background: #092756;
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3E1D6D', endColorstr='#092756',GradientType=1 );
  background: -webkit-radial-gradient(
      0% 100%,
      ellipse cover,
      rgba(104, 128, 138, 0.4) 10%,
      rgba(138, 114, 76, 0) 40%
    ),
    -webkit-linear-gradient(top, rgba(57, 173, 219, 0.25) 0%, rgba(
            42,
            60,
            87,
            0.4
          )
          100%),
    -webkit-linear-gradient(-45deg, #670d10 0%, #092756 100%);
`;
const Header = styled.h1`
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  text-align: center;
`;
const Form = styled.form`
  width: 300px;
  margin-top: -1rem;
`;
const Input = styled.input`
  width: calc(100% - 22px);
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  outline: none;
  padding: 10px;
  font-size: 13px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  box-shadow: inset 0 -5px 45px rgba(100, 100, 100, 0.2),
    0 1px 1px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.5s ease;

  &:focus {
    box-shadow: inset 0 -5px 45px rgba(100, 100, 100, 0.4),
      0 1px 1px rgba(255, 255, 255, 0.2);
  }
`;

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

type Props = {
  onLogin: (email: string, password: string) => void;
  onAnonimLogin: () => void;
  loading: boolean;
};

export const LoginForm = ({
  onLogin,
  onAnonimLogin,
  loading,
}: Props): React.ReactElement => {
  const [email, setEmail] = useState("y@Y.ru");
  const [password, setPassword] = useState("asd4");

  const onChange = useCallback(
    ({ target: { type, value } }: ChangeEvent<HTMLInputElement>) => {
      if (type === "password") {
        setPassword(value);
      } else if (type === "email") {
        setEmail(value);
      }
    },
    []
  );

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    onLogin(email, password);
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Header>Вход</Header>
        <Input
          type="email"
          maxLength={50}
          minLength={4}
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          inputMode="email"
        />
        <Input
          type="password"
          maxLength={50}
          minLength={4}
          placeholder="Пароль"
          required
          value={password}
          onChange={onChange}
        />
        <button type="button" onClick={onAnonimLogin}>
          Анонимная авторизация
        </button>
        <Button type="submit" disabled={loading}>
          {loading ? <StyledButtonLoader /> : <span>Войти</span>}
        </Button>
      </Form>
    </Container>
  );
};

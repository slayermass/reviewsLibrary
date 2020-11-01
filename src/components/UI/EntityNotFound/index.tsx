import React from "react";

type Props = {
  text: string;
};

export const UiEntityNotFound = ({ text }: Props): React.ReactElement => (
  <h1>{text}</h1>
);

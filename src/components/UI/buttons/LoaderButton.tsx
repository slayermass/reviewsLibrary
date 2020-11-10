import React from "react";
import styled from "styled-components";

import { StyledButtonLoader } from "components/UI/styled/StyledButtonLoader";
import { StyledPrimaryButton } from "components/UI/styled/StyledButton";

const Button = styled(StyledPrimaryButton)<{ loading: boolean }>`
  ${(p) => p.loading && "pointer-events: none;"}
`;

type Props = {
  loading: boolean;
  type: "submit" | "button";
  text: string;

  disabled?: boolean;
};

export const UiLoaderButton = ({
  loading,
  type,
  text,
  disabled,
}: Props): React.ReactElement => (
  <Button type={type} disabled={disabled} loading={loading}>
    {loading ? <StyledButtonLoader /> : <span>{text}</span>}
  </Button>
);

export const UiLoaderSubmitButton = (
  props: Omit<Props, "type">
): React.ReactElement => UiLoaderButton({ type: "submit", ...props });

"use client";

import styled from "styled-components";

type Props = {
  $align?: { horizontally?: string; vertically?: string };
};

export default styled.div<Props>`
  position: relative;
  display: ${(props) => (props.$align ? "flex" : "block")};
  justify-content: ${(props) => props.$align?.horizontally || "initial"};
  align-items: ${(props) => props.$align?.vertically || "initial"};

  & > * {
    position: absolute;
  }
`;

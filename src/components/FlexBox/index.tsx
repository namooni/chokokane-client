import { ComponentPropsWithoutRef, CSSProperties } from 'react';
import styled from 'styled-components';

export type FlexBoxProps = ComponentPropsWithoutRef<'div'> & {
  direction?: CSSProperties['flexDirection'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: CSSProperties['gap'];
  wrap?: CSSProperties['flexWrap'];
  inline?: boolean;
};

export const FlexBox = ({
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap,
  wrap = 'nowrap',
  inline = false,
  ...props
}: FlexBoxProps) => (
  <StyledFlexBox
    $direction={direction}
    $align={align}
    $justify={justify}
    $gap={gap}
    $wrap={wrap}
    $inline={inline}
    {...props}
  />
);

const StyledFlexBox = styled.div<{
  $direction: CSSProperties['flexDirection'];
  $align: CSSProperties['alignItems'];
  $justify: CSSProperties['justifyContent'];
  $gap: CSSProperties['gap'];
  $wrap: CSSProperties['flexWrap'];
  $inline: boolean;
}>`
  display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
  gap: ${({ $gap }) =>
    typeof $gap === 'number' ? `${$gap}px` : ($gap ?? '0')};
  flex-wrap: ${({ $wrap }) => $wrap};
`;

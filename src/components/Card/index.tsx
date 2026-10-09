import styled from 'styled-components';
import { FlexBox, type FlexBoxProps } from '../FlexBox';
import { colors } from '../../theme/palette';

type CardProps = Omit<FlexBoxProps, 'direction'> & {
  background?: string;
  border?: string;
};

const Card = ({
  background = colors.surfaceRaised,
  border = `1px solid ${colors.borderSubtle}`,
  gap = 0,
  ...props
}: CardProps) => {
  return (
    <CardWrap $background={background} $border={border} gap={gap} {...props} />
  );
};

const CardWrap = styled(FlexBox).attrs({
  direction: 'column',
})<{
  $background: string;
  $border: string;
}>`
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ $background }) => $background};
  border: ${({ $border }) => $border};
`;

export default Card;

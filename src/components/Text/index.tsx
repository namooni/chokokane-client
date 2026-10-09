import { ElementType, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/palette';

export type TextVariant =
  'display' | 'title' | 'subtitle' | 'body' | 'small' | 'caption';
export type TextTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'success'
  | 'danger'
  | 'inverse';

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  color?: string;
  weight?: 400 | 500 | 600 | 700;
};

export const Text = ({
  as: Component = 'div',
  variant = 'body',
  tone = 'default',
  color,
  weight,
  ...props
}: TextProps) => (
  <StyledText
    as={Component}
    $variant={variant}
    $tone={tone}
    $color={color}
    $weight={weight}
    {...props}
  />
);

const variants = {
  display: '2rem',
  title: '1.5rem',
  subtitle: '1.25rem',
  body: '1rem',
  small: '0.875rem',
  caption: '0.75rem',
} satisfies Record<TextVariant, string>;

const tones = {
  default: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  accent: colors.primary,
  success: colors.success,
  danger: colors.danger,
  inverse: colors.inverse,
} satisfies Record<TextTone, string>;

const StyledText = styled.div<{
  $variant: TextVariant;
  $tone: TextTone;
  $color?: string;
  $weight?: TextProps['weight'];
}>`
  color: ${({ $tone, $color }) => $color ?? tones[$tone]};
  font-size: ${({ $variant }) => variants[$variant]};
  font-weight: ${({ $weight, $variant }) =>
    $weight ?? ($variant === 'title' || $variant === 'display' ? 700 : 400)};
  line-height: 1.5;
`;

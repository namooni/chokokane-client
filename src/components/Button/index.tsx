import { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) => (
  <StyledButton
    $variant={variant}
    $size={size}
    $fullWidth={fullWidth}
    type={type}
    {...props}
  />
);

const variants = {
  primary: css`
    border-color: #163c2c;
    background: #163c2c;
    color: #fff;

    &:hover:not(:disabled) {
      border-color: #28533f;
      background: #28533f;
    }
  `,
  secondary: css`
    border-color: #d8d5ca;
    background: #fbfaf6;
    color: #37423b;

    &:hover:not(:disabled) {
      background: #e9eee8;
    }
  `,
  ghost: css`
    border-color: transparent;
    background: transparent;
    color: #52675a;

    &:hover:not(:disabled) {
      background: #e9eee8;
      color: #163c2c;
    }
  `,
  danger: css`
    border-color: #8c3c30;
    background: #8c3c30;
    color: #fff;

    &:hover:not(:disabled) {
      border-color: #702d24;
      background: #702d24;
    }
  `,
} satisfies Record<ButtonVariant, ReturnType<typeof css>>;

const sizes = {
  small: css`
    min-height: 34px;
    padding: 0 12px;
    font-size: 13px;
  `,
  medium: css`
    min-height: 42px;
    padding: 0 16px;
    font-size: 14px;
  `,
  large: css`
    min-height: 48px;
    padding: 0 20px;
    font-size: 16px;
  `,
} satisfies Record<ButtonSize, ReturnType<typeof css>>;

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid;
  border-radius: 10px;
  font: inherit;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  ${({ $variant }) => variants[$variant]}
  ${({ $size }) => sizes[$size]}

  &:focus-visible {
    outline: 3px solid #55776466;
    outline-offset: 2px;
  }

  &:disabled {
    border-color: #dfddd4;
    background: #f3f1e9;
    color: #858b86;
    cursor: not-allowed;
  }
`;

import styled from 'styled-components';
import { colors } from '../../theme/palette';

export const FormField = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;
export const FormInput = styled.input`
  width: 100%; min-width: 0; min-height: 48px; padding: 12px 14px;
  border: 1px solid ${colors.borderSubtle}; border-radius: 12px;
  outline-color: ${colors.primary}; background: ${colors.surfaceRaised};
  color: ${colors.text}; font-size: 0.875rem;
`;
export const PrimaryButton = styled.button`
  width: 100%; min-height: 52px; border: 0; border-radius: 14px;
  background: ${colors.primary}; color: ${colors.inverse};
  font-size: 1rem; font-weight: 700; cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
export const TextAction = styled.button`
  align-self: flex-start; padding: 8px 0; border: 0; background: transparent;
  color: ${colors.primary}; font-size: 0.875rem; font-weight: 600; cursor: pointer;
`;
export const FormSection = styled.section`
  display: flex; flex-direction: column; gap: 10px;
`;

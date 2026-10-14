import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme/palette';
import { FormInput, PrimaryButton } from '../components/ui/FormControls';

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 32px);
  color: ${colors.text};
`;
export const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0 24px;
`;
export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
`;
export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${colors.primary};
  color: ${colors.inverse};
`;
export const BackLink = styled(Link)`
  color: ${colors.textSecondary};
  font-size: 12px;
  text-decoration: none;
  padding: 12px 0;
`;
export const Region = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 4px 40px;
`;
export const Intro = styled.div`
  h1 {
    margin: 12px 0;
    font-size: 28px;
    line-height: 1.45;
  }
  p {
    margin: 8px 0 0;
    color: ${colors.textMuted};
    font-size: 13px;
    line-height: 1.8;
  }
`;
export const Eyebrow = styled.p`
  color: ${colors.primary} !important;
  font-size: 11px !important;
  font-weight: 700;
  letter-spacing: 0.08em;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;
export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
`;
export const Input = styled(FormInput)`
  font-size: 16px;
`;
export const Error = styled.p`
  margin: 0;
  color: ${colors.danger};
  font-size: 13px;
  line-height: 1.6;
`;
export const Success = styled.p`
  margin: 0;
  padding: 12px;
  border-radius: 12px;
  background: ${colors.successSoft};
  color: ${colors.success};
  font-size: 13px;
  line-height: 1.6;
`;
export const SubmitButton = styled(PrimaryButton)``;
export const Note = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 12px;
  text-align: center;
  line-height: 1.8;
`;
export const ActionLink = styled(Link)`
  color: ${colors.primary};
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  padding: 6px 0;
`;
export const Footer = styled.footer`
  margin-top: auto;
  padding: 24px 0 16px;
  border-top: 1px solid ${colors.borderSubtle};
  color: ${colors.textMuted};
  font-size: 11px;
  text-align: center;
  line-height: 1.8;
`;

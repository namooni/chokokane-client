import { ChangeEvent, ReactNode } from 'react';
import styled from 'styled-components';

export interface SelectOption {
  value: string;
  label: string;
}

type SelectInputProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

const SelectInput = ({ value, onChange, children }: SelectInputProps) => {
  return (
    <Select value={value} onChange={(event) => onChange(event)}>
      {children}
    </Select>
  );
};

const Select = styled.select`
  width: 100%;
  border: 1px solid #d8d6cd;
  background: #fff;
  border-radius: 10px;
  padding: 12px 13px;
  outline: none;

  &:focus {
    border-color: #557764;
  }
`;

export default SelectInput;

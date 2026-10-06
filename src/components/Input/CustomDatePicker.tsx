import DatePicker from 'react-datepicker';
import { ja } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

type CustomDatePickerProps = {
  value?: string;
  onChange: (value?: string) => void;
  required?: boolean;
};

const parseDate = (value?: string) => {
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (dateOnly) {
    return new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CustomDatePicker = ({
  value,
  onChange,
  required = false,
}: CustomDatePickerProps) => {
  const selectedDate = parseDate(value);

  return (
    <PickerFrame>
      <DatePicker
        selected={selectedDate}
        onChange={(
          date: Date | null,
          event: React.SyntheticEvent<any> | undefined,
        ) => {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }
          onChange(date ? formatDate(date) : undefined);
        }}
        dateFormat="yyyy/MM/dd"
        locale={ja}
        calendarStartDay={1}
        placeholderText="日付を選択"
        className="date-picker-input"
        calendarClassName="expense-calendar"
        popperClassName="expense-calendar-popper"
        showPopperArrow={false}
        required={required}
        isClearable={!required}
      />
    </PickerFrame>
  );
};

const PickerFrame = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
    width: 100%;
  }

  .date-picker-input {
    width: 100%;
    height: 44px;
    padding: 0 13px;
    border: 1px solid #d8d6cd;
    border-radius: 10px;
    outline: none;
    background: #fff;
    color: #17211b;
    font: inherit;
    transition:
      border-color 140ms ease,
      box-shadow 140ms ease;

    &:focus {
      border-color: #557764;
      box-shadow: 0 0 0 3px #5577641c;
    }
  }

  .react-datepicker {
    overflow: hidden;
    border: 1px solid #dfddd4;
    border-radius: 14px;
    background: #fbfaf6;
    box-shadow: 0 14px 36px #17211b1c;
    font-family: 'DM Sans', 'Noto Sans KR', sans-serif;
  }

  .react-datepicker__header {
    border-bottom: 1px solid #e5e2d8;
    background: #f3f1e9;
    padding-top: 12px;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header {
    color: #17211b;
    font-size: 14px;
    font-weight: 700;
  }

  .react-datepicker__day-name {
    color: #788079;
    font-size: 11px;
    font-weight: 600;
  }

  .react-datepicker__day {
    border-radius: 8px;
    color: #26352c;
    transition:
      background 120ms ease,
      color 120ms ease;

    &:hover {
      border-radius: 8px;
      background: #e4e9e2;
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: #163c2c;
    color: #fff;

    &:hover {
      background: #28533f;
    }
  }

  .react-datepicker__day--today {
    font-weight: 700;
    box-shadow: inset 0 0 0 1px #8da493;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #52675a;
  }

  .react-datepicker__triangle {
    display: none;
  }
`;

export default CustomDatePicker;

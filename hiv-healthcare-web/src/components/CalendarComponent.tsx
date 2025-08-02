import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarComponentProps {
  onChange: (value: Date | [Date, Date], event: React.MouseEvent<HTMLButtonElement>) => void;
  value: Date | null;
  selectRange?: boolean;
  locale?: string;
  className?: string;
  tileContent?: (props: { date: Date; view: string }) => React.ReactNode;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  onChange,
  value,
  selectRange = false,
  locale = "vi-VN",
  className = "",
  tileContent,
}) => {
  return (
    <Calendar
      onChange={onChange as any}
      value={value as any}
      selectRange={selectRange}
      locale={locale}
      className={className}
      tileContent={tileContent}
    />
  );
};

export default CalendarComponent;

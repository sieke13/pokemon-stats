import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './GameCalendar.css';
import { useTranslation } from 'react-i18next';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface GameCalendarProps {
  playedDates: Date[];
  onDateToggle: (date: Date) => void;
}

const GameCalendar: React.FC<GameCalendarProps> = ({ playedDates, onDateToggle }) => {
  const { t, i18n } = useTranslation();
  const [value, onChange] = useState<Value>(new Date());

  const tileClassName = ({ date }: { date: Date }) => {
    if (playedDates.some(playedDate => 
      playedDate.getDate() === date.getDate() &&
      playedDate.getMonth() === date.getMonth() &&
      playedDate.getFullYear() === date.getFullYear()
    )) {
      return 'played-date';
    }
    return '';
  };

  const handleDateClick = (value: Value) => {
    if (value instanceof Date) {
      onDateToggle(value);
    }
  };

  const formatMonthYear = (locale: string | undefined, date: Date) => {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    return `${t(`calendar.months.${monthNames[date.getMonth()]}`)} ${date.getFullYear()}`;
  };

  return (
    <div className="calendar-container">
      <h2>{t('calendar.title')}</h2>
      <Calendar 
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        formatShortWeekday={(locale, date) => {
          const day = date.getDay();
          const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          return t(`calendar.weekDays.${weekDays[day]}`);
        }}
        formatMonthYear={formatMonthYear}
        locale={i18n.language}
      />
    </div>
  );
};

export default GameCalendar;
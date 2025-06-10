import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './GameCalendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface GameCalendarProps {
  playedDates: Date[];
  onDateToggle: (date: Date) => void;
}

const GameCalendar: React.FC<GameCalendarProps> = ({ playedDates, onDateToggle }) => {
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

  return (
    <div className="calendar-container">
      <h2>Registro de Juego</h2>
      <Calendar 
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
      />
    </div>
  );
};

export default GameCalendar;
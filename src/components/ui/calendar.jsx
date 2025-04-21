import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar({ className, ...props }) {
  return (
    <DayPicker
      className={`bg-white text-black rounded-lg  ${className || ''}`}
      {...props}
    />
  );
}

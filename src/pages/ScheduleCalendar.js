import React from "react";
import { Calendar } from "antd";

const ScheduleCalendar = ({ onSelect, disabledDate }) => {
  return (
    <Calendar
      className="border w-72"
      fullscreen={false}
      onSelect={onSelect}
      disabledDate={disabledDate}
    />
  );
};

export default ScheduleCalendar;

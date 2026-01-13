import React, { useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar } from "smart-webcomponents-react/calendar";

const toYMD = (d) => {
 const yyyy = d.getFullYear();
 const mm = String(d.getMonth() + 1).padStart(2, "0");
 const dd = String(d.getDate()).padStart(2, "0");
 return `${yyyy}-${mm}-${dd}`;
};

const CalendarView = ({ onSelectedDate }) => {
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const currentDate =
  searchParams.get("date") || new Date().toISOString().split("T")[0];

 // URL 파라미터에서 날짜를 읽어서 selectedDates 설정
 const selectedDates = useMemo(() => [currentDate], [currentDate]);

 const handleChange = useCallback(
  (e) => {
   // Smart UI는 이벤트 객체(e.detail)로 값이 오는 경우가 많아서 안전하게 처리
   const next = e?.detail?.value?.[0] ?? e?.detail?.selectedDates?.[0];

   const dateStr =
    next instanceof Date ? toYMD(next) : typeof next === "string" ? next : null;

   if (dateStr && dateStr !== currentDate) {
    // 날짜가 실제로 변경된 경우에만 네비게이션
    if (onSelectedDate) {
     onSelectedDate(dateStr);
    } else {
     navigate(`/meals?date=${dateStr}`, { replace: true });
    }
   }
  },
  [currentDate, navigate, onSelectedDate]
 );

 return (
  <Calendar
   selectionMode="one"
   selectedDates={selectedDates}
   onChange={handleChange}
  />
 );
};

export default CalendarView;

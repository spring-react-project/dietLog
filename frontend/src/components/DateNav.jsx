import React, { useMemo } from "react";
import { format, addDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

const DateNav = ({ dateStr, onChange, dailyData }) => {
 const dateObj = useMemo(() => parseISO(dateStr), [dateStr]);

 const label = useMemo(() => {
  return format(dateObj, "yyyy년 M월 d일 (eee)", { locale: ko });
 }, [dateObj]);

 const totalCalories = dailyData?.totalCalories || 0;
 const mealCount = dailyData?.meals?.length || 0;

 const handlePrev = () => {
  const prevDate = format(addDays(dateObj, -1), "yyyy-MM-dd");
  onChange(prevDate);
 };

 const handleNext = () => {
  const nextDate = format(addDays(dateObj, 1), "yyyy-MM-dd");
  onChange(nextDate);
 };

 return (
  <Card className="date-nav-card mb-3 border-0 shadow-sm rounded-2">
   <Card.Body className="p-3">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
     {/* 날짜 네비게이션 */}
     <div className="d-flex align-items-center gap-2">
      <Button variant="outline-secondary" size="sm" onClick={handlePrev}>
       <i className="bi bi-chevron-left"></i> 이전
      </Button>
      <strong className="fs-5">{label}</strong>
      <Button variant="outline-secondary" size="sm" onClick={handleNext}>
       다음 <i className="bi bi-chevron-right"></i>
      </Button>
     </div>

     {/* 날짜별 요약 정보 */}
     <div className="d-flex align-items-center gap-3">
      <div className="text-center">
       <div className="text-muted small">식사</div>
       <Badge bg="primary" className="fs-6 px-3 py-2">
        {mealCount}끼
       </Badge>
      </div>
      <div className="text-center">
       <div className="text-muted small">총 칼로리</div>
       <Badge bg="warning" className="fs-6 px-3 py-2">
        {totalCalories}kcal
       </Badge>
      </div>
     </div>
    </div>
   </Card.Body>
  </Card>
 );
};

export default DateNav;

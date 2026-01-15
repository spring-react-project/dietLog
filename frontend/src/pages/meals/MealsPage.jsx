import React, { useEffect, useState, useMemo } from "react";
import { mealByDate } from "../../api/Meals";
import { useSearchParams, useNavigate } from "react-router-dom";
import DateNav from "../../components/DateNav.jsx";
import { getFoodIcon, getTypeBadge } from "../../util/icons";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const MealsPage = () => {
 const navigate = useNavigate();
 const [searchParams, setSearchParams] = useSearchParams();
 const urlDate =
  searchParams.get("date") || new Date().toISOString().split("T")[0];
 const [allMeals, setAllMeals] = useState(null);
 const [loading, setLoading] = useState(false);

 const totalCalories = allMeals?.totalCalories || 0;

 const dateForMeals = useMemo(() => {
  if (!allMeals?.meals || allMeals.meals.length === 0) return [];
  // 백엔드에서 이미 날짜별로 정렬된 meals를 받으므로 최근 3개만 선택
  return [...allMeals.meals].reverse();
 }, [allMeals]);

 const handleDateChange = (newDate) => {
  setSearchParams({ date: newDate }, { replace: true });
 };

 // URL 날짜가 변경되면 데이터 로드
 useEffect(() => {
  const load = async () => {
   try {
    setLoading(true);
    const data = await mealByDate(urlDate);
    setAllMeals(data);
   } catch (error) {
    console.error("Error fetching meals:", error);
    setAllMeals(null);
   } finally {
    setLoading(false);
   }
  };
  load();
 }, [urlDate]);

 return (
  <div>
   <DateNav
    dateStr={urlDate}
    onChange={handleDateChange}
    dailyData={allMeals}
   />

   {loading && (
    <div className="text-center py-4">
     <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
     </div>
    </div>
   )}

   {!loading && (
    <div className="allMealList">
     {dateForMeals.length === 0 ? (
      <Card className="border-0 shadow-sm rounded-2">
       <Card.Body className="text-center py-5">
        <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
        <p className="text-muted">해당 날짜에 기록된 식사가 없습니다.</p>
       </Card.Body>
      </Card>
     ) : (
      dateForMeals.map((item) => {
       const typeInfo = getTypeBadge(item.type);
       const foodIcon = getFoodIcon(item.iconKey);
       return (
        <Card key={item.id} className="mb-3 border-0 shadow-sm rounded-2">
         <Card.Body>
          <div className="d-flex p-1 align-items-center justify-content-between mb-2">
           <span className="fs-2 me-3">{foodIcon}</span>
           <span className={`badge ${typeInfo.className} px-3 py-2`}>
            <i className={`bi ${typeInfo.icon} me-1`}></i>
            {typeInfo.label}
           </span>
          </div>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
           <strong>{item.calories}</strong> kcal
          </Card.Text>
          {item.memo && (
           <Card.Text className="text-muted small mb-2">
            <i className="bi bi-chat-left-text me-1"></i>
            {item.memo}
           </Card.Text>
          )}
          <Button
           className="d-block w-100 mt-2"
           variant="outline-warning"
           size="sm"
           onClick={() =>
            navigate(`/meals/${item.id}`, {
             state: {
              meal: item,
              date: urlDate,
              totalCalories,
             },
            })
           }
          >
           <i className="bi bi-eye me-1"></i>
           상세보기
          </Button>
         </Card.Body>
        </Card>
       );
      })
     )}
    </div>
   )}
  </div>
 );
};

export default MealsPage;

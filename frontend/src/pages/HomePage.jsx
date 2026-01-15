import React, { useEffect, useState, useMemo } from "react";
import Badge from "react-bootstrap/Badge";
// import "./styles/Home.scss";
import { mealByDate } from "../api/Meals";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { getFoodIcon, getTypeBadge } from "../util/icons";
const HomePage = () => {
 const navigate = useNavigate();
 const [date] = useState(new Date().toISOString().split("T")[0]);
 const [daily, setDaily] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 useEffect(() => {
  const load = async () => {
   try {
    setLoading(true);
    setError("");
    const res = await mealByDate(date);
    console.log("API Response:", res);
    setDaily(res);
   } catch (error) {
    console.error("Error loading meals:", error);
    setDaily(null);
    setError("데이터를 불러오는데 실패했습니다.");
   } finally {
    setLoading(false);
   }
  };
  load();
 }, [date]);

 const recent3 = useMemo(() => {
  if (!daily?.meals || daily.meals.length === 0) return [];
  // 백엔드에서 이미 날짜별로 정렬된 meals를 받으므로 최근 3개만 선택
  return daily.meals.slice(-3).reverse();
 }, [daily]);

 const totalCalories = daily?.totalCalories || 0;
 const couunt = daily?.meals?.length || 0;

 return (
  <div className="home-container">
   <h2>오늘의 기록</h2>
   {loading && <div className="home-loading">loading...</div>}
   {error && <div className="home-error mt-3">{error}</div>}

   <div className="border-0 shadow-sm mb-4 bg-white  p-3 text-center rounded-2 calories-wrap mt-1">
    <h3>
     오늘 ({date}) 총<Badge bg="warning">{couunt}</Badge> 끼 식사
     <Badge bg="warning">{totalCalories}</Badge> kcal
    </h3>
   </div>

      {/* 버튼(이동/추가) */}
   <div className="btns-wrap d-flex justify-content-between mb-4 ">
    <Button
     variant="outline-primary"
     onClick={() => navigate(`/meals/all?date=${date}`)}
    >
     오늘 식단 전체 보기
    </Button>

    <Button variant="outline-success" onClick={() => navigate(`/meals/new`)}>
     식단 추가
    </Button>
   </div>

   {daily?.meals && daily.meals.length === 0 && (
    <div>오늘의 식사 기록이 없습니다.</div>
   )}
   <div className="content-wrap">
    <h2>최근 식사</h2>
    <div className="w-100 recent-meal-list d-flex justify-content-space-between gap-3">
     {recent3.length === 0 && <div>최근 식사가 없습니다.</div>}
     {recent3.map((item) => {
      const typeInfo = getTypeBadge(item.type);
      const foodIcon = getFoodIcon(item.iconKey);
      return (
       <Card key={item.id} className="w-100 mb-3 flex-grow-1 2 min-h-400 border-0 shadow-sm rounded-2">
        <Card.Body>
         <div className=" mb-3 text-center">
          {/* Food 아이콘 */}
          <div className="d-flex align-items-center justify-content-center flex-direction-column">
           <span className="fs-1 me-3 ">{foodIcon}</span>
           <div>
            <Card.Title className="mb-1">{item.name}</Card.Title>
            <Card.Text className="mb-0 text-muted">
             <strong className="text-dark ">{item.calories}</strong> kcal
            </Card.Text>
           </div>
          </div>

          {/* Type 배지 */}
          <span className={`badge ${typeInfo.className} px-3 py-2 mt-3`}>
           <i className={`bi ${typeInfo.icon} me-1`}></i>
           {typeInfo.label}
          </span>
         </div>

         {item.memo && (
          <Card.Text className="text-muted small mb-2">
           <i className="bi bi-chat-left-text me-1"></i>
           {item.memo}
          </Card.Text>
         )}

         <Button
         className="d-block w-100"
          variant="outline-warning"
          size="sm"
          state={{ meal: item }}
          onClick={() =>
           navigate(`/meals/${item.id}`, {
            state: {
             meal: item,
             date,
             totalCalories,
            },
           })
          }
         >
          <i className="bi bi-eye me-1 "></i>
          상세보기
         </Button>
        </Card.Body>
       </Card>
      );
     })}
    </div>
   </div>

  </div>
 );
};

export default HomePage;

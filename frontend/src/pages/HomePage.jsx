import React, { useEffect, useState, useMemo } from "react";
import Badge from "react-bootstrap/Badge";
import "./styles/Home.scss";
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
   {error && <div className="home-error">{error}</div>}

   <div className="content-wrap calories-wrap">
    <h3>
     오늘 ({date}) 총<Badge bg="warning">{couunt}</Badge> 끼 식사
     <Badge bg="warning">{totalCalories}</Badge> kcal
    </h3>
   </div>

   {daily?.meals && daily.meals.length === 0 && (
    <div>오늘의 식사 기록이 없습니다.</div>
   )}
   <div className="content-wrap">
    <h2>최근 식사</h2>
    <div className="recent-meal-list">
     {recent3.length === 0 && <div>최근 식사가 없습니다.</div>}
     {recent3.map((item) => {
      const typeInfo = getTypeBadge(item.type);
      const foodIcon = getFoodIcon(item.iconKey);
      return (
       <Card key={item.id} className="mb-3">
        <Card.Body>
         <div className="d-flex align-items-center justify-content-between mb-3">
          {/* Food 아이콘 */}
          <div className="d-flex align-items-center">
           <span className="fs-1 me-3">{foodIcon}</span>
           <div>
            <Card.Title className="mb-1">{item.name}</Card.Title>
            <Card.Text className="mb-0 text-muted">
             <strong className="text-dark">{item.calories}</strong> kcal
            </Card.Text>
           </div>
          </div>

          {/* Type 배지 */}
          <span className={`badge ${typeInfo.className} px-3 py-2`}>
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
          <i className="bi bi-eye me-1"></i>
          상세보기
         </Button>
        </Card.Body>
       </Card>
      );
     })}
    </div>
   </div>
   {/* 버튼(이동/추가) */}
   <div className="btns-wrap">
    <Button
     variant="outline-primary"
     onClick={() => navigate(`/meals?date=${date}`)}
    >
     오늘 식단 전체 보기
    </Button>

    <Button variant="outline-primary" onClick={() => navigate(`/meals/new`)}>
     식단 추가
    </Button>
   </div>
  </div>
 );
};

export default HomePage;

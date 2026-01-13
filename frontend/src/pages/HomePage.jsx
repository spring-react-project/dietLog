import React, { useEffect, useState, useMemo } from "react";
import "./styles/Home.scss";
import { mealByDate } from "../api/Meals";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
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
   <h1 className="home-title">Home</h1>
   {loading && <div className="home-loading">loading...</div>}
   {error && <div className="home-error">{error}</div>}
   <div>
    <p>
     오늘 ({date}) 총 {couunt}개, {totalCalories}kcal
    </p>
   </div>

   {daily?.meals && daily.meals.length === 0 && (
    <div>오늘의 식사 기록이 없습니다.</div>
   )}
   {loading && <div className="home-loading">loading...</div>}
   {error && <div className="home-error">{error}</div>}
   <div className="recent-meal-wrap">
    <h2>최근 식사</h2>
    <div className="recent-meal-list">
     {recent3.length === 0 && <div>최근 식사가 없습니다.</div>} 
      {recent3.map((item) => (
        <div className="home-meal-item" key={item.id}>
        {item.name} - {item.calories}kcal
        </div>
      ))}
   </div>
  </div>
    {/* 버튼(이동/추가) */}
      <div>
        <Button variant="outline-secondary" onClick={() => navigate(`/meals?date=${date}`)}>
          오늘 식단 보기
        </Button>

        <Button variant="outline-secondary" onClick={() => navigate(`/meals/new`)}>
          식단 추가
        </Button>
      </div>
  </div>
 );
};

export default HomePage;

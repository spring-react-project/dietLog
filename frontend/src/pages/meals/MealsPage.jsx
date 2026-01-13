import React, { useEffect, useState } from "react";
import { createMeal, mealByDate } from "../../api/Meals";
import { useSearchParams } from 'react-router-dom'
import CalendarView from "../../components/CalendarView";

const MealsPage = () => {
 const [searchParams, setSearchParams] = useSearchParams();
 const urlDate = searchParams.get('date') || new Date().toISOString().split("T")[0];
 const [meals, setMeals] = useState([]);

 const handleCreate = async () => {
  await createMeal({
   date: urlDate,
   type: "BREAKFAST",
   name: "Sample Meal",
   memo: "This is a sample meal.",
   calories: 300,
  });
  // 식사 생성 후 데이터 다시 로드
  const data = await mealByDate(urlDate);
  setMeals(data);
 };

 const handleDateChange = (newDate) => {
  setSearchParams({ date: newDate }, { replace: true });
 };

 // URL 날짜가 변경되면 데이터 로드
 useEffect(() => {
  const load = async () => {
   try {
    const data = await mealByDate(urlDate);
    setMeals(data);
   } catch (error) {
    console.error("Error fetching meals:", error);
   }
  };
  load();
 }, [urlDate]);

  return (
    <div>
      <CalendarView onSelectedDate={handleDateChange} />
      <button onClick={handleCreate}>Add Sample Meal</button>
    </div>
  )
}

export default MealsPage
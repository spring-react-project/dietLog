import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { updateMeal, getFoodsAll } from "../api/Meals";

const MealEditModal = ({ show, onHide, meal, onMealUpdated }) => {
 const [mealForm, setMealForm] = useState({
  date: "",
  type: "LUNCH",
  foodId: "",
  memo: "",
 });
 const [foods, setFoods] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // meal이 변경되면 폼 초기화
 useEffect(() => {
  if (meal && foods.length > 0) {
   // foodId가 없으면 음식 이름으로 찾기
   let foodId = meal.foodId || "";
   if (!foodId && meal.name) {
    const foundFood = foods.find((food) => food.name === meal.name);
    if (foundFood) {
     foodId = foundFood.id.toString();
    }
   }

   // 날짜 형식 변환 (LocalDate 문자열 또는 Date 객체 처리)
   let dateStr = meal.date;
   if (dateStr && typeof dateStr === "string") {
    // 이미 문자열이면 그대로 사용
    dateStr = dateStr.split("T")[0]; // ISO 형식에서 날짜만 추출
   } else if (!dateStr) {
    dateStr = new Date().toISOString().split("T")[0];
   }

   setMealForm({
    date: dateStr,
    type: meal.type || "LUNCH",
    foodId: foodId,
    memo: meal.memo || "",
   });
  }
 }, [meal, foods]);

 // 음식 목록 불러오기
 useEffect(() => {
  const fetchFoods = async () => {
   try {
    const data = await getFoodsAll();
    setFoods(Array.isArray(data) ? data : []);
   } catch (err) {
    console.error("음식 목록 불러오기 실패:", err);
    setFoods([]);
   }
  };
  if (show) {
   fetchFoods();
  }
 }, [show]);

 const handleMealChange = (e) => {
  const { name, value } = e.target;
  setMealForm((prev) => ({ ...prev, [name]: value }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!mealForm.foodId) {
   setError("음식을 선택해주세요.");
   setLoading(false);
   return;
  }

  try {
   const mealData = {
    date: mealForm.date,
    type: mealForm.type,
    foodId: parseInt(mealForm.foodId),
    memo: mealForm.memo || null,
   };

   await updateMeal(meal.id, mealData);
   alert("식사 기록이 수정되었습니다.");
   if (onMealUpdated) {
    onMealUpdated();
   }
   onHide();
  } catch (err) {
   console.error("식사 수정 실패:", err);
   const errorMessage =
    err?.response?.data?.message || err?.message || "식사 수정에 실패했습니다.";
   setError(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 const handleClose = () => {
  setError(null);
  onHide();
 };

 return (
  <Modal show={show} onHide={handleClose} size="lg">
   <Modal.Header closeButton>
    <Modal.Title>식사 수정</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    {error && (
     <div className="alert alert-danger" role="alert">
      {error}
     </div>
    )}

    <Form onSubmit={handleSubmit}>
     <Form.Group className="mb-3">
      <Form.Label>날짜</Form.Label>
      <Form.Control
       type="date"
       name="date"
       value={mealForm.date}
       onChange={handleMealChange}
       required
      />
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>종류</Form.Label>
      <Form.Select
       name="type"
       value={mealForm.type}
       onChange={handleMealChange}
       required
      >
       <option value="BREAKFAST">아침</option>
       <option value="LUNCH">점심</option>
       <option value="DINNER">저녁</option>
       <option value="SNACK">간식</option>
      </Form.Select>
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>음식 선택</Form.Label>
      <Form.Select
       name="foodId"
       value={mealForm.foodId}
       onChange={handleMealChange}
       required
      >
       <option value="">음식 선택</option>
       {foods.length === 0 ? (
        <option disabled>등록된 음식이 없습니다.</option>
       ) : (
        foods.map((food) => (
         <option key={food.id} value={food.id}>
          {food.name} ({food.calories}kcal)
         </option>
        ))
       )}
      </Form.Select>
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>메모 (선택)</Form.Label>
      <Form.Control
       as="textarea"
       rows={3}
       name="memo"
       value={mealForm.memo}
       onChange={handleMealChange}
       placeholder="식사에 대한 메모를 입력하세요"
      />
     </Form.Group>
     <div className="d-flex gap-2">
      <Button type="submit" variant="primary" disabled={loading}>
       {loading ? "수정 중..." : "수정하기"}
      </Button>
      <Button variant="secondary" onClick={handleClose}>
       취소
      </Button>
     </div>
    </Form>
   </Modal.Body>
  </Modal>
 );
};

export default MealEditModal;

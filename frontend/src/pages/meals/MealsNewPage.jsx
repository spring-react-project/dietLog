import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import "../styles/MealsNewPage.scss";
import { createMeal, getFoodsAll } from "../../api/Meals";
import FoodSearchModal from "../../components/FoodSearchModal";
import FoodCreateModal from "../../components/FoodCreateModal";

const initialMealState = {
 date: new Date().toISOString().split("T")[0], // 오늘 날짜 기본값
 type: "LUNCH",
 foodId: "", // 음식 선택용
 memo: "",
};

const MealsNewPage = () => {
 const navigate = useNavigate();
 const [mealForm, setMealForm] = useState(initialMealState);
 const [foods, setFoods] = useState([]); // 음식 목록
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [showSearchModal, setShowSearchModal] = useState(false);
 const [showCreateModal, setShowCreateModal] = useState(false);

 // 한끼 등록 폼 핸들러
 const handleMealChange = (e) => {
  const { name, value } = e.target;
  setMealForm((prev) => ({ ...prev, [name]: value }));
 };

 // 음식 목록 갱신 (모달에서 음식이 생성된 후 호출)
 const handleFoodCreated = () => {
  fetchFoods();
 };

 // 한끼 저장
 const handleMealSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!mealForm.foodId) {
   alert("음식을 선택해주세요.");
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

   await createMeal(mealData);
   alert("한끼 식사가 저장되었습니다.");

   // 저장 후 해당 날짜의 식단 페이지로 이동
   navigate(`/meals?date=${mealForm.date}`);
  } catch (err) {
   console.error("한끼 저장 실패:", err);
   const errorMessage =
    err?.response?.data?.message || err?.message || "한끼 저장에 실패했습니다.";
   alert(`한끼 저장 실패: ${errorMessage}`);
   setError(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 // 음식 목록 불러오기
 const fetchFoods = async () => {
  try {
   const data = await getFoodsAll();
   setFoods(Array.isArray(data) ? data : []);
  } catch (err) {
   console.error("음식 목록 불러오기 실패:", err);
   setFoods([]);
  }
 };

 useEffect(() => {
  fetchFoods();
 }, []);

 return (
  <div className="meals-new-page">
   <h2>새로운 음식 및 한끼 등록</h2>
   <p>새로운 음식을 추가하고 한끼 식사를 기록하세요.</p>

   {error && (
    <div className="alert alert-danger" role="alert">
     {error}
    </div>
   )}

   {/* 음식 등록 옵션 버튼 */}
   <Card className="mb-4">
    <Card.Body className="text-center">
     <div className="d-flex gap-3 justify-content-center flex-wrap">
      <Button
       variant="primary"
       size="lg"
       onClick={() => setShowSearchModal(true)}
       className="px-4 py-3"
      >
       <i className="bi bi-search me-2"></i>
       칼로리 검색
      </Button>
      <Button
       variant="success"
       size="lg"
       onClick={() => setShowCreateModal(true)}
       className="px-4 py-3"
      >
       <i className="bi bi-plus-circle me-2"></i>
       음식 등록
      </Button>
     </div>
    </Card.Body>
   </Card>

   {/* 모달 컴포넌트 */}
   <FoodSearchModal
    show={showSearchModal}
    onHide={() => setShowSearchModal(false)}
    onFoodCreated={handleFoodCreated}
   />
   <FoodCreateModal
    show={showCreateModal}
    onHide={() => setShowCreateModal(false)}
    onFoodCreated={handleFoodCreated}
   />

   <Card>
    <Card.Header>
     <h3>한끼(meal) 등록</h3>
    </Card.Header>
    <Card.Body>
     <Form onSubmit={handleMealSubmit}>
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
         <option disabled>
          등록된 음식이 없습니다. 위에서 음식을 먼저 등록해주세요.
         </option>
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
      <Button
       type="submit"
       variant="success"
       disabled={loading || !mealForm.foodId}
      >
       {loading ? "저장 중..." : "한끼 저장"}
      </Button>
     </Form>
    </Card.Body>
   </Card>
  </div>
 );
};

export default MealsNewPage;

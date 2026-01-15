import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createFood } from "../api/Meals";

const initialFoodState = {
 name: "",
 calories: "",
 iconKey: "",
 category: "",
};

const FoodCreateModal = ({ show, onHide, onFoodCreated }) => {
 const [foodForm, setFoodForm] = useState(initialFoodState);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // 음식 등록 폼 핸들러
 const handleFoodChange = (e) => {
  const { name, value } = e.target;
  setFoodForm((prev) => ({ ...prev, [name]: value }));
 };

 // 음식 저장
 const handleFoodSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
   const foodData = {
    name: foodForm.name,
    calories: parseInt(foodForm.calories),
    iconKey: foodForm.iconKey,
    category: foodForm.category || null,
   };

   await createFood(foodData);
   alert("음식이 저장되었습니다.");
   setFoodForm(initialFoodState);
   if (onFoodCreated) {
    onFoodCreated();
   }
   onHide();
  } catch (err) {
   console.error("음식 저장 실패:", err);
   let errorMessage = "음식 저장에 실패했습니다.";
   
   // 409 Conflict (중복) 또는 500 에러 처리
   if (err?.response?.status === 409) {
    errorMessage = err?.response?.data || "이미 등록된 음식입니다.";
   } else if (err?.response?.status === 500) {
    const serverMessage = err?.response?.data;
    if (serverMessage && (serverMessage.includes("Duplicate") || serverMessage.includes("이미 등록된"))) {
     errorMessage = "이미 등록된 음식입니다.";
    } else {
     errorMessage = err?.response?.data?.message || err?.message || errorMessage;
    }
   } else {
    errorMessage = err?.response?.data?.message || err?.response?.data || err?.message || errorMessage;
   }
   
   setError(errorMessage);
  } finally {
   setLoading(false);
  }
 };

 const handleClose = () => {
  setFoodForm(initialFoodState);
  setError(null);
  onHide();
 };

 return (
  <Modal show={show} onHide={handleClose} size="lg">
   <Modal.Header closeButton>
    <Modal.Title>음식(food) 등록</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    {error && (
     <div className="alert alert-danger" role="alert">
      {error}
     </div>
    )}

    <Form onSubmit={handleFoodSubmit}>
     <Form.Group className="mb-3">
      <Form.Label>식품이름</Form.Label>
      <Form.Control
       type="text"
       name="name"
       value={foodForm.name}
       onChange={handleFoodChange}
       required
       placeholder="예: 라면, 고구마 등"
      />
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>칼로리</Form.Label>
      <Form.Control
       type="number"
       name="calories"
       value={foodForm.calories}
       onChange={handleFoodChange}
       required
       min="0"
       placeholder="예: 300"
      />
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>아이콘 키</Form.Label>
      <Form.Control
       type="text"
       name="iconKey"
       value={foodForm.iconKey}
       onChange={handleFoodChange}
       required
       placeholder="예: noodle, sweet_potato, rice 등"
      />
      <Form.Text className="text-muted">
       사용 가능한 아이콘: rice, noodle, bread, sweet_potato, chicken, meat,
       fish, salad, fruit, dessert, coffee 등
      </Form.Text>
     </Form.Group>
     <Form.Group className="mb-3">
      <Form.Label>카테고리 (선택)</Form.Label>
      <Form.Control
       type="text"
       name="category"
       value={foodForm.category}
       onChange={handleFoodChange}
       placeholder="예: 탄수화물, 단백질, 채소 등"
      />
     </Form.Group>
     <div className="d-flex gap-2">
      <Button type="submit" variant="primary" disabled={loading}>
       {loading ? "저장 중..." : "음식 저장"}
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

export default FoodCreateModal;

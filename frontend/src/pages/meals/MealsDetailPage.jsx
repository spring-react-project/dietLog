import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getFoodIcon, getTypeBadge } from "../../util/icons";
import "./../styles/MealsDetailPage.scss";
import { deleteMeal } from "../../api/Meals";
import Badge from "react-bootstrap/Badge";
import MealEditModal from "../../components/MealEditModal";

const MealsDetailPage = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const meal = location.state?.meal;
 const [showEditModal, setShowEditModal] = useState(false);

 // state가 없으면 이전 페이지로 이동
 if (!meal) {
  navigate(-1);
  return null;
 }

 const foodIcon = getFoodIcon(meal.iconKey);
 const typeInfo = getTypeBadge(meal.type);

 const handleDelete = async () => {
  if (window.confirm("정말 이 식사 기록을 삭제하시겠습니까?")) {
   try {
    await deleteMeal(meal.id);
    alert("식사 기록이 삭제되었습니다.");
    navigate(-1);
   } catch (error) {
    console.error("Error deleting meal:", error);
    const errorMessage =
     error?.response?.data?.message ||
     error?.message ||
     "알 수 없는 오류가 발생했습니다.";
    alert(`식사 기록 삭제에 실패했습니다: ${errorMessage}`);
   }
  }
 };

 const handleMealUpdated = () => {
  // 수정 후 페이지 새로고침 또는 데이터 갱신
  window.location.reload();
 };

 return (
  <>
   <Card className="food-card">
    <Card.Body>
     <div className="food-icon-wrap">{foodIcon}</div>
     <Card.Title>{meal.name}</Card.Title>
     <span className={`badge ${typeInfo.className} px-3 py-2`}>
      <i className={`bi ${typeInfo.icon} me-1`}></i>
      {typeInfo.label}
     </span>
     {meal.memo && <Card.Text className="memo">{meal.memo}</Card.Text>}
     <Card.Text className="calory">{meal.calories} kcal</Card.Text>
     <div className="btn-wrap">
      <Button variant="danger" onClick={handleDelete}>
       삭제하기
      </Button>
      <Button variant="success" onClick={() => setShowEditModal(true)}>
       <i className="bi bi-pencil me-1"></i>
       수정하기
      </Button>
     </div>
    </Card.Body>
   </Card>

   <MealEditModal
    show={showEditModal}
    onHide={() => setShowEditModal(false)}
    meal={{
     ...meal,
     date: meal.date || location.state?.date,
    }}
    onMealUpdated={handleMealUpdated}
   />
  </>
 );
};

export default MealsDetailPage;

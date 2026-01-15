import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import { searchFoods, createFood } from "../api/Meals";

const FoodSearchModal = ({ show, onHide, onFoodCreated }) => {
 const [searchKeyword, setSearchKeyword] = useState("");
 const [minKcal, setMinKcal] = useState("");
 const [maxKcal, setMaxKcal] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const [searchLoading, setSearchLoading] = useState(false);
 const [error, setError] = useState(null);

 // CSV에서 음식 검색
 const handleSearch = async () => {
  if (!searchKeyword.trim() && !minKcal && !maxKcal) {
   alert("검색어 또는 칼로리 범위를 입력해주세요.");
   return;
  }

  setSearchLoading(true);
  setError(null);
  try {
   const params = {};
   if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
   if (minKcal) params.minKcal = parseFloat(minKcal);
   if (maxKcal) params.maxKcal = parseFloat(maxKcal);

   const results = await searchFoods(params);
   setSearchResults(results);
  } catch (err) {
   console.error("검색 실패:", err);
   setError("검색에 실패했습니다.");
   setSearchResults([]);
  } finally {
   setSearchLoading(false);
  }
 };

 // 검색 결과에서 음식 선택하여 Food로 등록
 const handleSelectFromSearch = async (searchItem) => {
  try {
   // iconKey를 name에서 추론
   const iconKeyMap = {
    라면: "noodle",
    밥: "rice",
    고구마: "sweet_potato",
    닭: "chicken",
    고기: "meat",
    생선: "fish",
    샐러드: "salad",
    과일: "fruit",
    커피: "coffee",
    김밥: "rice",
    국밥: "soup",
    덮밥: "rice",
   };

   let iconKey = "rice"; // 기본값
   for (const [key, value] of Object.entries(iconKeyMap)) {
    if (searchItem.name.includes(key)) {
     iconKey = value;
     break;
    }
   }

   const foodData = {
    name: searchItem.name,
    calories: Math.round(searchItem.kcal || 0),
    iconKey: iconKey,
    category: searchItem.category || null,
   };

   const result = await createFood(foodData);
   // 백엔드에서 중복일 경우 기존 음식을 반환하므로 성공으로 처리
   alert("음식이 등록되었습니다.");
   setSearchKeyword("");
   setSearchResults([]);
   if (onFoodCreated) {
    onFoodCreated();
   }
  } catch (err) {
   console.error("음식 등록 실패:", err);
   let errorMessage = "음식 등록에 실패했습니다.";
   
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
   
   alert(`음식 등록 실패: ${errorMessage}`);
  }
 };

 const handleClose = () => {
  setSearchKeyword("");
  setMinKcal("");
  setMaxKcal("");
  setSearchResults([]);
  setError(null);
  onHide();
 };

 return (
  <Modal show={show} onHide={handleClose} size="lg">
   <Modal.Header closeButton>
    <Modal.Title>칼로리 데이터베이스 검색</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    {error && (
     <div className="alert alert-danger" role="alert">
      {error}
     </div>
    )}

    <div className="mb-3">
     <Form.Label>음식명 검색</Form.Label>
     <InputGroup className="mb-2">
      <Form.Control
       type="text"
       placeholder="예: 라면, 김밥, 고구마 등"
       value={searchKeyword}
       onChange={(e) => setSearchKeyword(e.target.value)}
       onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button variant="primary" onClick={handleSearch} disabled={searchLoading}>
       {searchLoading ? "검색 중..." : "검색"}
      </Button>
     </InputGroup>
     <div className="row g-2">
      <div className="col-md-6">
       <Form.Label>최소 칼로리</Form.Label>
       <Form.Control
        type="number"
        placeholder="예: 100"
        value={minKcal}
        onChange={(e) => setMinKcal(e.target.value)}
       />
      </div>
      <div className="col-md-6">
       <Form.Label>최대 칼로리</Form.Label>
       <Form.Control
        type="number"
        placeholder="예: 500"
        value={maxKcal}
        onChange={(e) => setMaxKcal(e.target.value)}
       />
      </div>
     </div>
    </div>

    {searchResults.length > 0 && (
     <div className="mb-3">
      <h5>검색 결과 ({searchResults.length}개)</h5>
      <div
       style={{
        maxHeight: "400px",
        overflowY: "auto",
        border: "1px solid #dee2e6",
        borderRadius: "0.375rem",
        padding: "0.5rem",
       }}
      >
       {searchResults.map((item, index) => (
        <Card key={index} className="mb-2">
         <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center">
           <div>
            <strong>{item.name}</strong>
            <div className="text-muted small">
             {item.kcal}kcal / {item.baseAmount}g | {item.category}
            </div>
           </div>
           <Button
            size="sm"
            variant="outline-primary"
            onClick={() => handleSelectFromSearch(item)}
           >
            선택
           </Button>
          </div>
         </Card.Body>
        </Card>
       ))}
      </div>
     </div>
    )}
   </Modal.Body>
   <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
     닫기
    </Button>
   </Modal.Footer>
  </Modal>
 );
};

export default FoodSearchModal;

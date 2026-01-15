import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import "../styles/MealsNewPage.scss";
import { createFood, createMeal, getFoodsAll, searchFoods } from "../../api/Meals";

const initialFoodState = {
 name: "",
 calories: "",
 iconKey: "",
 category: "",
};

const initialMealState = {
 date: new Date().toISOString().split("T")[0], // 오늘 날짜 기본값
 type: "LUNCH",
 foodId: "", // 음식 선택용
 memo: "",
};

const MealsNewPage = () => {
 const navigate = useNavigate();
 const [foodForm, setFoodForm] = useState(initialFoodState);
 const [mealForm, setMealForm] = useState(initialMealState);
 const [foods, setFoods] = useState([]); // 음식 목록
 const [searchResults, setSearchResults] = useState([]); // CSV 검색 결과
 const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
 const [minKcal, setMinKcal] = useState("");
 const [maxKcal, setMaxKcal] = useState("");
 const [searchLoading, setSearchLoading] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // 음식 등록 폼 핸들러
 const handleFoodChange = (e) => {
  const { name, value } = e.target;
  setFoodForm((prev) => ({ ...prev, [name]: value }));
 };

 // 한끼 등록 폼 핸들러
 const handleMealChange = (e) => {
  const { name, value } = e.target;
  setMealForm((prev) => ({ ...prev, [name]: value }));
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
   fetchFoods(); // 저장 후 목록 갱신
  } catch (err) {
   console.error("음식 저장 실패:", err);
   const errorMessage =
    err?.response?.data?.message || err?.message || "음식 저장에 실패했습니다.";
   alert(`음식 저장 실패: ${errorMessage}`);
   setError(errorMessage);
  } finally {
   setLoading(false);
  }
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

 // CSV에서 음식 검색
 const handleSearch = async () => {
  if (!searchKeyword.trim() && !minKcal && !maxKcal) {
   alert("검색어 또는 칼로리 범위를 입력해주세요.");
   return;
  }

  setSearchLoading(true);
  try {
   const params = {};
   if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
   if (minKcal) params.minKcal = parseFloat(minKcal);
   if (maxKcal) params.maxKcal = parseFloat(maxKcal);

   const results = await searchFoods(params);
   setSearchResults(results);
  } catch (err) {
   console.error("검색 실패:", err);
   alert("검색에 실패했습니다.");
   setSearchResults([]);
  } finally {
   setSearchLoading(false);
  }
 };

 // 검색 결과에서 음식 선택하여 Food로 등록
 const handleSelectFromSearch = async (searchItem) => {
  try {
   // iconKey를 name에서 추론하거나 기본값 사용
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

   await createFood(foodData);
   alert("음식이 등록되었습니다.");
   setSearchKeyword("");
   setSearchResults([]);
   fetchFoods(); // 목록 갱신
  } catch (err) {
   console.error("음식 등록 실패:", err);
   alert("음식 등록에 실패했습니다.");
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

   <Card className="mb-4">
    <Card.Header>
     <h3>칼로리 데이터베이스 검색</h3>
    </Card.Header>
    <Card.Body>
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
         maxHeight: "300px",
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
    </Card.Body>
   </Card>

   <Card className="mb-4">
    <Card.Header>
     <h3>음식(food) 등록</h3>
    </Card.Header>
    <Card.Body>
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
      <Button type="submit" variant="primary" disabled={loading}>
       {loading ? "저장 중..." : "음식 저장"}
      </Button>
     </Form>
    </Card.Body>
   </Card>

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

# Diet Log - 식단 관리 애플리케이션 명세서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [데이터베이스 스키마](#데이터베이스-스키마)
5. [백엔드 API 명세](#백엔드-api-명세)
6. [프론트엔드 컴포넌트](#프론트엔드-컴포넌트)
7. [주요 기능](#주요-기능)
8. [실행 방법](#실행-방법)

---

## 프로젝트 개요

**Diet Log**는 Spring Boot와 React를 활용한 식단 관리 웹 애플리케이션입니다. 사용자는 일일 식사 기록을 관리하고, 칼로리를 추적하며, 음식 데이터베이스를 검색하여 식단을 등록할 수 있습니다.

### 주요 특징

- 📅 날짜별 식사 기록 관리
- 🔍 대용량 칼로리 데이터베이스 검색 (18만+ 음식 데이터)
- 📊 일일 칼로리 및 식사 횟수 통계
- 🎨 직관적인 UI/UX (Bootstrap 기반)
- 🐳 Docker Compose를 통한 간편한 개발 환경

---

## 기술 스택

### Backend

- **Java 17**
- **Spring Boot 3.5.9**
  - Spring Web
  - Spring Data JPA
  - Spring Boot Actuator
- **MySQL 8.0**
- **Lombok**
- **Gradle**

### Frontend

- **React 19.2.0**
- **React Router DOM 7.12.0**
- **React Bootstrap 2.10.10**
- **Bootstrap 5.3.8**
- **Bootstrap Icons 1.13.1**
- **Axios 1.13.2**
- **date-fns 4.1.0**
- **Vite 7.2.5**
- **SASS/SCSS**

### Infrastructure

- **Docker & Docker Compose**
- **MySQL 8.0**

---

## 프로젝트 구조

```
dietLog/
├── backend/                    # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/jpabook/jpabasic/
│   │       │   ├── api/        # REST Controllers
│   │       │   │   ├── dto/    # Data Transfer Objects
│   │       │   │   ├── FoodController.java
│   │       │   │   ├── FoodSearchController.java
│   │       │   │   └── MealController.java
│   │       │   ├── domain/     # JPA Entities
│   │       │   │   ├── Food.java
│   │       │   │   ├── Meal.java
│   │       │   │   └── MealType.java
│   │       │   ├── repository/ # JPA Repositories
│   │       │   ├── service/     # Business Logic
│   │       │   └── config/     # Configuration
│   │       └── resources/
│   │           ├── application.yml
│   │           └── foods_kcal_category_merged.csv  # 칼로리 데이터
│   └── build.gradle
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── api/                # API 클라이언트
│   │   │   └── Meals.js
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   │   ├── DateNav.jsx
│   │   │   ├── FoodCreateModal.jsx
│   │   │   ├── FoodSearchModal.jsx
│   │   │   └── MealEditModal.jsx
│   │   ├── layouts/           # 레이아웃 컴포넌트
│   │   │   └── RootLayout.jsx
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── HomePage.jsx
│   │   │   ├── meals/
│   │   │   │   ├── MealsPage.jsx
│   │   │   │   ├── MealsNewPage.jsx
│   │   │   │   └── MealsDetailPage.jsx
│   │   │   └── styles/         # 페이지별 스타일
│   │   ├── router/             # 라우팅 설정
│   │   │   └── index.jsx
│   │   ├── styles/             # 전역 스타일
│   │   │   ├── main.scss
│   │   │   ├── _variables.scss
│   │   │   ├── _reset.scss
│   │   │   └── _mixins.scss
│   │   ├── util/               # 유틸리티 함수
│   │   │   ├── icons.js
│   │   │   └── dateObj.js
│   │   └── lib/                # 라이브러리 설정
│   │       └── apiClient.js
│   └── package.json
│
└── docker-compose.yml          # Docker Compose 설정
```

---

## 데이터베이스 스키마

### Food (음식)

| 컬럼명     | 타입     | 제약조건           | 설명                      |
| ---------- | -------- | ------------------ | ------------------------- |
| id         | BIGINT   | PK, AUTO_INCREMENT | 음식 ID                   |
| name       | VARCHAR  | NOT NULL, UNIQUE   | 음식 이름                 |
| calories   | INT      | NOT NULL           | 칼로리                    |
| icon_key   | VARCHAR  | NOT NULL           | 아이콘 키 (이모지 매핑용) |
| category   | VARCHAR  | NULL               | 카테고리                  |
| created_at | DATETIME | NOT NULL           | 생성일시                  |
| updated_at | DATETIME | NOT NULL           | 수정일시                  |

### Meal (식사)

| 컬럼명     | 타입        | 제약조건           | 설명                                        |
| ---------- | ----------- | ------------------ | ------------------------------------------- |
| id         | BIGINT      | PK, AUTO_INCREMENT | 식사 ID                                     |
| date       | DATE        | NOT NULL           | 식사 날짜                                   |
| type       | VARCHAR(20) | NOT NULL           | 식사 종류 (BREAKFAST, LUNCH, DINNER, SNACK) |
| food_id    | BIGINT      | NOT NULL, FK       | 음식 ID (Food 참조)                         |
| calories   | INT         | NOT NULL           | 칼로리 (Food에서 복사)                      |
| memo       | TEXT        | NULL               | 메모                                        |
| created_at | DATETIME    | NOT NULL           | 생성일시                                    |
| updated_at | DATETIME    | NOT NULL           | 수정일시                                    |

### 관계

- `Meal` (Many) ↔ `Food` (One): `food_id` 외래키

---

## 백엔드 API 명세

### Base URL

```
http://localhost:8080/api
```

### 1. Meal (식사) API

#### 1.1 식사 생성

```http
POST /meals
Content-Type: application/json

{
  "date": "2026-01-15",
  "type": "LUNCH",
  "foodId": 1,
  "memo": "맛있었어요"
}
```

**Response:**

```json
{
 "id": 1,
 "date": "2026-01-15",
 "type": "LUNCH",
 "name": "라면",
 "calories": 500,
 "memo": "맛있었어요",
 "createdAt": "2026-01-15T10:00:00",
 "updatedAt": "2026-01-15T10:00:00"
}
```

#### 1.2 날짜별 식사 조회

```http
GET /meals?date=2026-01-15
```

**Response:**

```json
{
 "date": "2026-01-15",
 "totalCalories": 1318,
 "meals": [
  {
   "id": 1,
   "type": "BREAKFAST",
   "name": "라면",
   "calories": 500,
   "memo": null,
   "iconKey": "noodle"
  }
 ]
}
```

#### 1.3 식사 상세 조회

```http
GET /meals/{id}
```

**Response:**

```json
{
 "id": 1,
 "date": "2026-01-15",
 "type": "LUNCH",
 "name": "라면",
 "calories": 500,
 "memo": "맛있었어요",
 "createdAt": "2026-01-15T10:00:00",
 "updatedAt": "2026-01-15T10:00:00"
}
```

#### 1.4 식사 수정

```http
PUT /meals/{id}
Content-Type: application/json

{
  "date": "2026-01-15",
  "type": "DINNER",
  "foodId": 2,
  "memo": "수정된 메모"
}
```

**Response:** MealResponse (상세 조회와 동일)

#### 1.5 식사 삭제

```http
DELETE /meals/{id}
```

**Response:** 204 No Content

---

### 2. Food (음식) API

#### 2.1 음식 목록 조회

```http
GET /foods
```

**Response:**

```json
[
 {
  "id": 1,
  "name": "라면",
  "calories": 500,
  "iconKey": "noodle",
  "category": "탄수화물"
 }
]
```

#### 2.2 음식 생성

```http
POST /foods
Content-Type: application/json

{
  "name": "라면",
  "calories": 500,
  "iconKey": "noodle",
  "category": "탄수화물"
}
```

**Response:**

- 201 Created: 새로 생성된 음식
- 200 OK: 이미 존재하는 음식 (중복 시 기존 음식 반환)

---

### 3. Food Search (칼로리 검색) API

#### 3.1 통합 검색

```http
GET /foods/search?keyword=라면&minKcal=100&maxKcal=500&category=탄수화물
```

**Query Parameters:**

- `keyword` (optional): 음식명 검색
- `minKcal` (optional): 최소 칼로리
- `maxKcal` (optional): 최대 칼로리
- `category` (optional): 카테고리

**Response:**

```json
[
 {
  "uid": "1",
  "foodCode": "F001",
  "name": "라면",
  "category": "탄수화물",
  "kcal": 500.0,
  "baseAmount": 100.0,
  "source": "식약처",
  "group": "면류"
 }
]
```

**참고:** 최대 100개 결과 반환

#### 3.2 이름으로 검색

```http
GET /foods/search/name?keyword=라면
```

#### 3.3 칼로리 범위 검색

```http
GET /foods/search/kcal?min=100&max=500
```

#### 3.4 카테고리 검색

```http
GET /foods/search/category?category=탄수화물
```

---

## 프론트엔드 컴포넌트

### 페이지 컴포넌트

#### HomePage (`/`)

- 오늘 날짜의 식사 기록 요약
- 총 칼로리 및 식사 횟수 표시
- 최근 3개 식사 카드 표시
- "오늘 식단 전체 보기", "식단 추가" 버튼

#### MealsPage (`/meals`, `/meals/all`)

- 날짜별 식사 목록 조회
- DateNav 컴포넌트로 날짜 이동
- 각 식사 카드에 상세보기 버튼

#### MealsNewPage (`/meals/new`)

- 칼로리 검색 모달 (FoodSearchModal)
- 음식 등록 모달 (FoodCreateModal)
- 한끼 식사 등록 폼

#### MealsDetailPage (`/meals/:id`)

- 식사 상세 정보 표시
- 수정 모달 (MealEditModal)
- 삭제 기능

### 공통 컴포넌트

#### DateNav

- 날짜 네비게이션 (이전/다음)
- 일일 총 칼로리 및 식사 횟수 표시

#### FoodSearchModal

- CSV 데이터베이스에서 음식 검색
- 검색 결과에서 음식 선택하여 등록

#### FoodCreateModal

- 새로운 음식 수동 등록

#### MealEditModal

- 식사 정보 수정

### 유틸리티

#### icons.js

- `getFoodIcon(iconKey)`: 아이콘 키에 따른 이모지 반환
- `getTypeBadge(type)`: 식사 종류에 따른 배지 정보 반환

---

## 주요 기능

### 1. 식사 기록 관리

- ✅ 식사 등록 (날짜, 종류, 음식, 메모)
- ✅ 식사 수정
- ✅ 식사 삭제
- ✅ 날짜별 식사 조회
- ✅ 일일 칼로리 및 식사 횟수 통계

### 2. 음식 관리

- ✅ 음식 등록 (이름, 칼로리, 아이콘 키, 카테고리)
- ✅ 음식 목록 조회
- ✅ 중복 음식 처리 (이미 존재하면 기존 음식 반환)

### 3. 칼로리 검색

- ✅ 음식명 검색
- ✅ 칼로리 범위 검색
- ✅ 카테고리 검색
- ✅ 통합 검색 (여러 조건 조합)
- ✅ CSV 데이터베이스 활용 (18만+ 음식 데이터)

### 4. UI/UX

- ✅ React Bootstrap 기반 반응형 디자인
- ✅ 모달을 통한 직관적인 폼 입력
- ✅ 날짜 네비게이션
- ✅ 음식 아이콘 및 식사 종류 배지 표시
- ✅ 로딩 상태 및 에러 처리

---

## 실행 방법

### 사전 요구사항

- Docker & Docker Compose
- (선택) Java 17, Node.js 18+ (로컬 개발 시)

### Docker Compose로 실행

1. **프로젝트 클론 및 이동**

```bash
cd dietLog
```

2. **Docker Compose로 서비스 시작**

```bash
docker-compose up -d
```

3. **서비스 확인**

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- MySQL: localhost:3306

4. **로그 확인**

```bash
# 백엔드 로그
docker logs spring-back -f

# 프론트엔드 로그
docker logs vite-front -f

# MySQL 로그
docker logs mysql-crud -f
```

5. **서비스 중지**

```bash
docker-compose down
```

### 로컬 개발 환경

#### Backend

```bash
cd backend
./gradlew bootRun
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 환경 변수

### Docker Compose 환경 변수

| 변수명              | 기본값   | 설명                |
| ------------------- | -------- | ------------------- |
| MYSQL_ROOT_PASSWORD | rootpass | MySQL root 비밀번호 |
| MYSQL_DATABASE      | cruddb   | 데이터베이스 이름   |
| MYSQL_USER          | cruduser | MySQL 사용자        |
| MYSQL_PASSWORD      | crudpass | MySQL 비밀번호      |

### Backend 환경 변수

| 변수명                     | 설명                  |
| -------------------------- | --------------------- |
| SPRING_DATASOURCE_URL      | MySQL 연결 URL        |
| SPRING_DATASOURCE_USERNAME | 데이터베이스 사용자명 |
| SPRING_DATASOURCE_PASSWORD | 데이터베이스 비밀번호 |

---

## 데이터베이스 마이그레이션

### 자동 마이그레이션

Spring Boot JPA의 `ddl-auto: update` 설정으로 자동 스키마 업데이트가 수행됩니다.

### 수동 마이그레이션

`DatabaseMigration` 컴포넌트를 통해 특정 마이그레이션을 수행할 수 있습니다.

**활성화 방법:**

```yaml
# application.yml
app:
 db:
  migration:
   enabled: true
```

---

## 파일 구조 상세

### Backend 주요 파일

#### Controllers

- `MealController.java`: 식사 관련 REST API
- `FoodController.java`: 음식 관련 REST API
- `FoodSearchController.java`: 칼로리 검색 API

#### Services

- `MealService.java`: 식사 비즈니스 로직
- `FoodService.java`: 음식 비즈니스 로직
- `FoodSearchService.java`: CSV 기반 칼로리 검색 로직

#### Entities

- `Meal.java`: 식사 엔티티
- `Food.java`: 음식 엔티티
- `MealType.java`: 식사 종류 Enum

### Frontend 주요 파일

#### API 클라이언트

- `api/Meals.js`: 모든 API 호출 함수

#### 라우팅

- `router/index.jsx`: React Router 설정

#### 스타일

- `styles/main.scss`: 전역 스타일
- `styles/_variables.scss`: SCSS 변수
- `styles/_reset.scss`: CSS 리셋
- `styles/_mixins.scss`: SCSS 믹스인

---

## 개발 가이드

### 코드 스타일

- **Backend**: Java 네이밍 컨벤션, Lombok 활용
- **Frontend**: React 함수형 컴포넌트, Hooks 사용

### 에러 처리

- Backend: Spring의 `@ExceptionHandler` 또는 ResponseEntity 활용
- Frontend: try-catch 및 사용자 친화적 에러 메시지 표시

### 상태 관리

- React의 `useState`, `useEffect` 활용
- 전역 상태 관리 라이브러리 미사용 (필요 시 추가 가능)

---

## 향후 개선 사항

- [ ] 사용자 인증/인가 기능
- [ ] 다중 사용자 지원
- [ ] 식사 사진 업로드
- [ ] 칼로리 통계 차트
- [ ] 식사 알림 기능
- [ ] 모바일 앱 (React Native)
- [ ] PWA 지원

---

## 라이선스

이 프로젝트는 개인 학습 목적으로 개발되었습니다.

---

## 작성일

2026-01-15

---

## 버전

- Backend: 0.0.1-SNAPSHOT
- Frontend: 0.0.0

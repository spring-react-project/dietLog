# DB 스키마 수정 가이드

## 문제
`meals` 테이블에 `name` 컬럼이 NOT NULL로 남아있어서, 새로운 설계(Food 엔티티 관계 사용)와 충돌합니다.

## 해결 방법

### 방법 1: MySQL에 직접 실행 (가장 빠름) ⚡

Docker를 사용하는 경우:
```bash
docker exec -it mysql-crud mysql -u cruduser -pcrudpass cruddb
```

또는 로컬 MySQL:
```bash
mysql -u cruduser -p cruddb
```

그 다음 SQL 실행:
```sql
ALTER TABLE meals DROP COLUMN name;
```

### 방법 2: 자동 마이그레이션 사용

1. `application.yml`에 설정 추가:
```yaml
app:
  db:
    migration:
      enabled: true
```

2. 애플리케이션 재시작

### 방법 3: SQL 스크립트 파일 사용

생성된 파일: `backend/src/main/resources/schema-update.sql`

MySQL 클라이언트에서:
```bash
mysql -u cruduser -p cruddb < backend/src/main/resources/schema-update.sql
```

## 확인

마이그레이션 후 확인:
```sql
DESCRIBE meals;
```

`name` 컬럼이 없어야 합니다.

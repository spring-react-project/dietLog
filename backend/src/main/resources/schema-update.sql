-- meals 테이블에서 name 컬럼 제거 (Food 엔티티와 관계로 대체됨)
-- 방법 1: 컬럼 제거 (권장)
ALTER TABLE meals DROP COLUMN IF EXISTS name;

-- 방법 2: 컬럼을 NULL 허용으로 변경 (기존 데이터 보존이 필요한 경우)
-- ALTER TABLE meals MODIFY COLUMN name VARCHAR(255) NULL;

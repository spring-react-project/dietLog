-- meals 테이블에서 name 컬럼 제거
-- Food 엔티티와의 관계로 대체되었으므로 더 이상 필요하지 않음
ALTER TABLE meals DROP COLUMN IF EXISTS name;

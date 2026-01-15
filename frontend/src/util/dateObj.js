export function toDateString(date) {
 const d = date instanceof Date ? date : new Date(date);
 const year = d.getFullYear();
 const month = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${year}-${month}-${day}`;
}

export function toKoreanDate(dateStr) {
 const [y, m, d] = dateStr.split("-");
 return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function parseDate(dateStr) {
 const [y, m, d] = dateStr.split("-").map(Number);
 if (!y || !m || !d) throw new Error("Invalid date string");
 return new Date(y, m - 1, d); // ✅ 로컬 날짜로 생성
}

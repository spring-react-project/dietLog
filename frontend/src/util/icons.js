 // ✅ Food 아이콘 매핑 (더 다양하게 분류)
 export const getFoodIcon = (iconKey) => {
  const foodIconMap = {
   // 주식류
   rice: "🍚",
   noodle: "🍜",
   bread: "🍞",
   pasta: "🍝",
   pizza: "🍕",

   // 채소/튀김류
   sweet_potato: "🍠",
   potato: "🥔",
   corn: "🌽",
   vegetable: "🥬",

   // 육류
   chicken: "🍗",
   meat: "🥩",
   pork: "🥓",
   beef: "🥩",
   lamb: "🍖",

   // 해산물
   fish: "🐟",
   shrimp: "🦐",
   crab: "🦀",
   sushi: "🍣",

   // 건강식
   salad: "🥗",
   soup: "🍲",
   stew: "🍲",

   // 과일
   fruit: "🍎",
   apple: "🍎",
   banana: "🍌",
   orange: "🍊",
   strawberry: "🍓",
   grape: "🍇",
   watermelon: "🍉",

   // 디저트/간식
   dessert: "🍰",
   cake: "🎂",
   cookie: "🍪",
   icecream: "🍦",
   chocolate: "🍫",
   candy: "🍬",

   // 음료
   coffee: "☕",
   tea: "🍵",
   juice: "🧃",
   milk: "🥛",
   water: "💧",
   beer: "🍺",
   wine: "🍷",

   // 기타
   egg: "🥚",
   cheese: "🧀",
   butter: "🧈",
   yogurt: "🥤",
  };

  return foodIconMap[iconKey] || "🍽️";
 };

 // ✅ 타입별 배지 (Bootstrap 아이콘 사용)
 export const getTypeBadge = (type) => {
  const typeBadgeMap = {
   BREAKFAST: {
    icon: "bi-sunrise",
    className: "bg-warning text-dark",
    label: "아침",
    color: "warning",
   },
   LUNCH: {
    icon: "bi-egg-fried",
    className: "bg-primary text-white",
    label: "점심",
    color: "primary",
   },
   DINNER: {
    icon: "bi-moon-stars",
    className: "bg-info text-white",
    label: "저녁",
    color: "info",
   },
   SNACK: {
    icon: "bi-cookie",
    className: "bg-success text-white",
    label: "간식",
    color: "success",
   },
  };

  return (
   typeBadgeMap[type] ?? {
    icon: "bi-clock",
    className: "bg-secondary text-white",
    label: type || "식사",
    color: "secondary",
   }
  );
 };
import React, { useState } from 'react';

const initialState = {
  date: '',
  type: 'LUNCH',
  name: '',
  calories: '',
  memo: '',
};

const MealsNewPage = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <div className="meals-new-page">
      <h2>식사 기록 추가</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>날짜</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div>
          <label>종류</label>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="BREAKFAST">아침</option>
            <option value="LUNCH">점심</option>
            <option value="DINNER">저녁</option>
            <option value="SNACK">간식</option>
          </select>
        </div>
        <div>
          <label>이름</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>칼로리</label>
          <input type="number" name="calories" value={form.calories} onChange={handleChange} required min="0" />
        </div>
        <div>
          <label>메모</label>
          <input type="text" name="memo" value={form.memo} onChange={handleChange} />
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
};

export default MealsNewPage;
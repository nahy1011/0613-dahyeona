import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeacherLogin from './pages/TeacherLogin';
import StudentSignup from './pages/StudentSignup';
import TodoList from './pages/TodoList';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/login">교사 로그인</Link></li>
            <li><Link to="/signup">학생 회원가입</Link></li>
            <li><Link to="/todos">할 일 목록</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<TeacherLogin />} />
          <Route path="/signup" element={<StudentSignup />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/" element={<h2>메인 페이지입니다. 메뉴를 선택하세요.</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

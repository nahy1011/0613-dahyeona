import React, { useState } from 'react';

export default function StudentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Implement Firebase Auth for Student
    console.log('Student Signup:', email);
  };

  return (
    <div className="auth-container">
      <h2>학생 회원가입</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          placeholder="이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

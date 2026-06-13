import { useState } from 'react';
import { Users, UserPlus, Trash2, Edit2 } from 'lucide-react';
import './StudentManager.css';

export default function StudentManager({ students, setStudents }) {
  const [inputText, setInputText] = useState('');

  const handleAddStudents = () => {
    if (!inputText.trim()) return;
    
    // Split by newline, comma, or space to support bulk add
    const newNames = inputText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
      
    // Filter out duplicates
    const uniqueNewNames = newNames.filter(name => !students.includes(name));
    
    setStudents([...students, ...uniqueNewNames]);
    setInputText('');
  };

  const handleRemoveStudent = (nameToRemove) => {
    setStudents(students.filter(name => name !== nameToRemove));
  };

  const handleClearAll = () => {
    if (window.confirm('정말 모든 학생 명단을 삭제하시겠습니까?')) {
      setStudents([]);
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full student-manager">
      <div className="header">
        <h2>
          <Users className="icon" /> 학생 명단 관리
        </h2>
        <span className="badge">총 {students.length}명</span>
      </div>
      
      <div className="input-group">
        <textarea 
          placeholder="이름을 입력하세요. 쉼표(,)나 줄바꿈으로 여러 명을 한 번에 추가할 수 있습니다."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
        />
        <button className="btn-primary" onClick={handleAddStudents}>
          <UserPlus size={18} /> 추가하기
        </button>
      </div>

      <div className="list-container mt-4">
        {students.length === 0 ? (
          <div className="empty-state">
            학생을 추가해주세요.
          </div>
        ) : (
          <ul className="student-list">
            {students.map((student, idx) => (
              <li key={`${student}-${idx}`} className="student-item">
                <span>{student}</span>
                <button className="icon-btn danger" onClick={() => handleRemoveStudent(student)} title="삭제">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {students.length > 0 && (
        <button className="btn-danger-outline mt-4 w-full" onClick={handleClearAll}>
          전체 삭제
        </button>
      )}
    </div>
  );
}

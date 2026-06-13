import { useState, useEffect } from 'react';
import { X, Settings, ArrowUp, ArrowDown } from 'lucide-react';
import './SecretMenu.css';

export default function SecretMenu({ isOpen, onClose, students, secretSequence, setSecretSequence }) {
  const [selectedStudents, setSelectedStudents] = useState(secretSequence || []);

  useEffect(() => {
    setSelectedStudents(secretSequence || []);
  }, [secretSequence, isOpen]);

  if (!isOpen) return null;

  const handleAdd = (student) => {
    setSelectedStudents([...selectedStudents, student]);
  };

  const handleRemove = (index) => {
    const newSeq = [...selectedStudents];
    newSeq.splice(index, 1);
    setSelectedStudents(newSeq);
  };

  const moveItem = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newSeq = [...selectedStudents];
      const temp = newSeq[index - 1];
      newSeq[index - 1] = newSeq[index];
      newSeq[index] = temp;
      setSelectedStudents(newSeq);
    } else if (direction === 'down' && index < selectedStudents.length - 1) {
      const newSeq = [...selectedStudents];
      const temp = newSeq[index + 1];
      newSeq[index + 1] = newSeq[index];
      newSeq[index] = temp;
      setSelectedStudents(newSeq);
    }
  };

  const handleSave = () => {
    setSecretSequence(selectedStudents);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2><Settings className="icon" /> 시크릿 메뉴</h2>
          <button className="icon-btn" onClick={onClose}><X /></button>
        </div>
        
        <div className="modal-body">
          <p className="description">
            발표자가 뽑히는 순서를 미리 정해둘 수 있습니다. 여기에 추가된 순서대로 먼저 당첨됩니다. 
            모두 뽑히고 나면 다시 랜덤으로 뽑힙니다.
          </p>

          <div className="secret-layout">
            <div className="available-students">
              <h3>전체 학생</h3>
              <div className="student-pool">
                {students.map(student => (
                  <button 
                    key={student} 
                    className="pool-btn"
                    onClick={() => handleAdd(student)}
                  >
                    {student} +
                  </button>
                ))}
              </div>
            </div>

            <div className="sequence-list">
              <h3>조작된 순서 (위에서부터)</h3>
              {selectedStudents.length === 0 ? (
                <div className="empty-sequence">순서가 정해지지 않았습니다. 순수 랜덤입니다.</div>
              ) : (
                <ul className="sequence-items">
                  {selectedStudents.map((student, idx) => (
                    <li key={`${student}-${idx}`} className="sequence-item">
                      <span className="seq-num">{idx + 1}</span>
                      <span className="seq-name">{student}</span>
                      <div className="seq-actions">
                        <button className="icon-btn-small" onClick={() => moveItem(idx, 'up')} disabled={idx === 0}><ArrowUp size={14}/></button>
                        <button className="icon-btn-small" onClick={() => moveItem(idx, 'down')} disabled={idx === selectedStudents.length - 1}><ArrowDown size={14}/></button>
                        <button className="icon-btn-small danger" onClick={() => handleRemove(idx)}><X size={14}/></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn-primary" onClick={handleSave}>저장 및 적용</button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import StudentManager from './components/StudentManager';
import SlotMachine from './components/SlotMachine';
import SecretMenu from './components/SecretMenu';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [students, setStudents] = useLocalStorage('random-presenter-students', []);
  const [secretSequence, setSecretSequence] = useLocalStorage('random-presenter-sequence', []);
  
  const [isSecretMenuOpen, setIsSecretMenuOpen] = useState(false);

  // Secret shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + S
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSecretMenuOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="title-text">✨ 랜덤 발표자 추첨 ✨</h1>
        <p className="subtitle">누가 발표하게 될까요? 긴장하시라!</p>
      </header>

      <main className="app-main">
        <div className="layout-grid">
          <div className="sidebar">
            <StudentManager 
              students={students} 
              setStudents={setStudents} 
            />
          </div>
          
          <div className="main-content">
            <SlotMachine 
              students={students}
              secretSequence={secretSequence}
              setSecretSequence={setSecretSequence}
            />
          </div>
        </div>
      </main>

      <SecretMenu 
        isOpen={isSecretMenuOpen}
        onClose={() => setIsSecretMenuOpen(false)}
        students={students}
        secretSequence={secretSequence}
        setSecretSequence={setSecretSequence}
      />
      
      {/* Invisible trigger for Secret Menu for fallback (click 5 times fast) */}
      <div 
        className="invisible-trigger" 
        onClick={(e) => {
          if (e.detail === 5) {
            setIsSecretMenuOpen(true);
          }
        }}
        title="비밀 버튼"
      />
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './SlotMachine.css';

export default function SlotMachine({ students, secretSequence, setSecretSequence }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawCount, setDrawCount] = useState(1);
  const [winners, setWinners] = useState([]);
  
  // To show spinning animation we cycle through names
  const [displayNames, setDisplayNames] = useState(Array(drawCount).fill('?'));
  
  const spinInterval = useRef(null);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4F46E5', '#EC4899', '#F59E0B']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4F46E5', '#EC4899', '#F59E0B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const startSpin = () => {
    if (students.length === 0) {
      alert("학생을 먼저 추가해주세요!");
      return;
    }

    if (students.length < drawCount) {
      alert(`학생 수가 부족합니다. (현재: ${students.length}명, 뽑을 인원: ${drawCount}명)`);
      return;
    }

    setIsSpinning(true);
    setWinners([]);
    
    // Animation effect of spinning slots
    spinInterval.current = setInterval(() => {
      const randomNames = Array(drawCount).fill(null).map(() => {
        return students[Math.floor(Math.random() * students.length)];
      });
      setDisplayNames(randomNames);
    }, 100);

    // Determine winners after delay
    setTimeout(() => {
      clearInterval(spinInterval.current);
      determineWinners();
      setIsSpinning(false);
      triggerConfetti();
    }, 3000); // 3 seconds spin
  };

  const determineWinners = () => {
    let currentWinners = [];
    let availableStudents = [...students];
    let currentSecretSequence = [...secretSequence];

    for (let i = 0; i < drawCount; i++) {
      let winner;
      
      // Check if we have a secret sequence
      if (currentSecretSequence.length > 0) {
        // Find the first student in sequence that is still available in the pool
        const seqIndex = currentSecretSequence.findIndex(s => availableStudents.includes(s));
        
        if (seqIndex !== -1) {
          winner = currentSecretSequence[seqIndex];
          // Remove from sequence since they were picked
          currentSecretSequence.splice(seqIndex, 1);
        } else {
          // If no one in sequence is available, pick randomly
          const randIdx = Math.floor(Math.random() * availableStudents.length);
          winner = availableStudents[randIdx];
        }
      } else {
        // Pure random
        const randIdx = Math.floor(Math.random() * availableStudents.length);
        winner = availableStudents[randIdx];
      }

      currentWinners.push(winner);
      // Remove from available to avoid duplicates in the same draw
      availableStudents = availableStudents.filter(s => s !== winner);
    }

    setWinners(currentWinners);
    setDisplayNames(currentWinners);
    
    // Update secret sequence if it was used
    if (secretSequence.length > 0) {
      setSecretSequence(currentSecretSequence);
    }
  };

  return (
    <div className="slot-machine-container">
      <div className="controls glass-panel">
        <label>
          뽑을 인원:
          <select 
            value={drawCount} 
            onChange={(e) => setDrawCount(Number(e.target.value))}
            disabled={isSpinning}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}명</option>
            ))}
          </select>
        </label>
      </div>

      <div className="slots-area">
        {displayNames.map((name, idx) => (
          <div key={idx} className="slot-box glass-panel">
            <div className="slot-window">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={name}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`slot-name ${!isSpinning && winners.length > 0 ? 'winner' : ''}`}
                >
                  {name}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="action-area">
        <button 
          className="spin-btn" 
          onClick={startSpin} 
          disabled={isSpinning || students.length === 0}
        >
          {isSpinning ? '추출 중...' : '발표자 뽑기!'}
        </button>
      </div>
    </div>
  );
}

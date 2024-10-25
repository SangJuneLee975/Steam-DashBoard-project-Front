import React, { useState, useEffect, useMemo } from 'react';
import '../css/Piano.css';

// keyMap 정의
const keyMap = [
  { key: 'a', note: 'A', frequency: 261.63, isBlack: false },
  { key: 'w', note: 'W', frequency: 277.18, isBlack: true, position: 1 },
  { key: 's', note: 'S', frequency: 293.66, isBlack: false },
  { key: 'e', note: 'E', frequency: 311.13, isBlack: true, position: 2 },
  { key: 'd', note: 'D', frequency: 329.63, isBlack: false },
  { key: 'f', note: 'F', frequency: 349.23, isBlack: false },
  { key: 't', note: 'T', frequency: 369.99, isBlack: true, position: 4 },
  { key: 'g', note: 'G', frequency: 392.0, isBlack: false },
  { key: 'y', note: 'Y', frequency: 415.3, isBlack: true, position: 5 },
  { key: 'h', note: 'H', frequency: 440.0, isBlack: false },
  { key: 'u', note: 'U', frequency: 466.16, isBlack: true, position: 6 },
  { key: 'j', note: 'J', frequency: 493.88, isBlack: false },
  { key: 'k', note: 'K', frequency: 523.25, isBlack: false },
];

const PianoKey = ({
  note,
  frequency,
  onPlay,
  isBlack,
  position,
  isActive,
  onMouseDown,
  onMouseUp,
}) => (
  <div
    className={`piano-key ${isBlack ? 'black' : 'white'} ${
      isActive ? 'piano-key--active' : ''
    }`}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    style={isBlack ? { left: `${position * 50 - 15}px` } : {}}
  >
    <span>{note}</span>
  </div>
);

const Piano = () => {
  const [pressedKey, setPressedKey] = useState(null);
  const [waveform, setWaveform] = useState('sine'); // 파형 상태 추가
  const [gain, setGain] = useState(0.5); // 게인 상태 추가
  const [selectedScore, setSelectedScore] = useState(null); // 선택된 악보 상태 추가

  const scores = [
    '/images/score1.png',
    '/images/score2.png',
    '/images/score3.png',
    '/images/score4.png',
    '/images/score5.png',
  ];

  const audioContext = useMemo(
    () => new (window.AudioContext || window.webkitAudioContext)(),
    []
  );

  const resumeAudioContext = async () => {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  };

  const playNote = async (frequency) => {
    await resumeAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(gain / 100, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const foundKey = keyMap.find((k) => k.key === key);

    if (foundKey && pressedKey !== key) {
      setPressedKey(key);
      playNote(foundKey.frequency);
    }
  };

  const handleKeyUp = () => {
    setPressedKey(null);
  };

  const handleMouseDown = (key, frequency) => {
    setPressedKey(key);
    playNote(frequency);
  };

  const handleMouseUp = () => {
    setPressedKey(null);
  };

  useEffect(() => {
    setSelectedScore(scores[0]); // 페이지 진입시 악보1 표시
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleScoreSelect = (score) => {
    if (selectedScore === score) {
      setSelectedScore(null);
    } else {
      setSelectedScore(score);
    }
  };

  return (
    <div className="piano-background">
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="piano">
            {keyMap.map((keyInfo, index) => (
              <PianoKey
                key={index}
                note={keyInfo.note}
                frequency={keyInfo.frequency}
                isBlack={keyInfo.isBlack}
                position={keyInfo.position}
                isActive={pressedKey === keyInfo.key}
                onMouseDown={() =>
                  handleMouseDown(keyInfo.key, keyInfo.frequency)
                }
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>

          <div className="controls" style={{ marginTop: '20px' }}>
            <div className="waveform">
              <p>파형 선택</p>
              {['sine', 'square', 'triangle', 'sawtooth'].map((wave) => (
                <label key={wave} style={{ marginRight: '15px' }}>
                  <input
                    type="radio"
                    value={wave}
                    checked={waveform === wave}
                    onChange={(e) => setWaveform(e.target.value)}
                  />
                  {wave.charAt(0).toUpperCase() + wave.slice(1)}
                </label>
              ))}
            </div>

            <div className="gain" style={{ marginTop: '10px' }}>
              <p>음량 : {Math.round(gain)}</p>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={gain}
                onChange={(e) => setGain(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="score-list">
          <h3>악보 리스트</h3>
          <ul>
            {scores.map((score, index) => (
              <li
                key={index}
                className={selectedScore === score ? 'selected' : ''}
                onClick={() => handleScoreSelect(score)}
              >
                <input
                  type="checkbox"
                  checked={selectedScore === score}
                  readOnly
                  style={{ marginRight: '10px' }}
                />
                악보 {index + 1}
              </li>
            ))}
          </ul>
          {selectedScore && (
            <div className="score-image">
              <img src={selectedScore} alt="Selected Score" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Piano;

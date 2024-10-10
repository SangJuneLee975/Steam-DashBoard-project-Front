import React, { useState, useRef, useEffect } from 'react';
import '../css/TodoModal.css';
import { startSpeechRecognition } from './speechRecognition';
import {
  startAudioVisualization,
  stopAudioVisualization,
} from './audioVisualizer';

const TodoModal = ({ todo = {}, onSave, onClose }) => {
  const [title, setTitle] = useState(todo.title || '');
  const [description, setDescription] = useState(todo.description || '');
  const [isListening, setIsListening] = useState(false);
  const canvasRef = useRef(null);
  const [audioStream, setAudioStream] = useState(null);

  const handleSave = () => {
    if (title.trim()) {
      onSave({ ...todo, title, description });
      onClose();
    } else {
      alert('제목을 입력하세요.');
    }
  };

  const stopAudio = () => {
    if (audioStream) {
      stopAudioVisualization(audioStream);
      const tracks = audioStream.getTracks();
      tracks.forEach((track) => track.stop());
      setAudioStream(null);
    }
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      startAudioVisualization(canvasRef, stream);
      return stream;
    } catch (error) {
      console.error('Error starting audio stream:', error);
      setIsListening(false);
    }
  };

  // 음성 인식으로 제목을 입력받는 함수
  const handleSpeechToTitle = async () => {
    if (isListening) return;
    setIsListening(true);

    const stream = await startAudio(); // 오디오 비주얼라이저 시작

    startSpeechRecognition(
      (transcript) => {
        setTitle(transcript);
        stopAudio(); // 음성 인식이 끝나면 오디오 스트림 종료
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        stopAudio(); // 에러 발생 시에도 오디오 스트림 종료
        setIsListening(false);
      }
    );
  };

  const handleSpeechToDescription = async () => {
    if (isListening) return;
    setIsListening(true);

    const stream = await startAudio(); // 오디오 비주얼라이저 시작

    startSpeechRecognition(
      (transcript) => {
        setDescription(transcript);
        stopAudio(); // 음성 인식이 끝나면 오디오 스트림 종료
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        stopAudio(); // 에러 발생 시에도 오디오 스트림 종료
        setIsListening(false);
      }
    );
  };

  useEffect(() => {
    return () => {
      stopAudio(); // 컴포넌트 언마운트 시 오디오 스트림 종료
    };
  }, [audioStream]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{todo.id ? '할 일 수정' : '할 일 추가'}</h2>
        <div>
          <label>할 일 제목</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <button
              onClick={handleSpeechToTitle}
              style={{ marginLeft: '10px' }}
            >
              🎤
            </button>
          </div>
        </div>
        <div>
          <label>할 일 내용</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
              style={{ width: '100%', height: '80px', marginBottom: '10px' }}
            />
            <button
              onClick={handleSpeechToDescription}
              style={{ marginLeft: '10px' }}
            >
              🎤
            </button>
          </div>
        </div>
        {isListening && (
          <div>
            <canvas
              ref={canvasRef}
              width="300"
              height="100"
              style={{ background: 'black', marginTop: '10px' }}
            ></canvas>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>
            취소
          </button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;

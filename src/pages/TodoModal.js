import React, { useState, useRef, useEffect } from 'react';
import '../css/TodoModal.css';
import { startSpeechRecognition } from './speechRecognition';
import {
  startAudioVisualization,
  stopAudioVisualization,
} from './audioVisualizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

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

  const handleSpeechToTitle = async () => {
    if (isListening) return;
    setIsListening(true);

    const stream = await startAudio();

    startSpeechRecognition(
      (transcript) => {
        setTitle(transcript);
        stopAudio();
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        stopAudio();
        setIsListening(false);
      }
    );
  };

  const handleSpeechToDescription = async () => {
    if (isListening) return;
    setIsListening(true);

    const stream = await startAudio();

    startSpeechRecognition(
      (transcript) => {
        setDescription(transcript);
        stopAudio();
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        stopAudio();
        setIsListening(false);
      }
    );
  };

  useEffect(() => {
    return () => {
      stopAudio();
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
            <button onClick={handleSpeechToTitle} className="mic-button">
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          </div>
        </div>
        <div>
          <label>할 일 내용</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <button onClick={handleSpeechToDescription} className="mic-button">
              <FontAwesomeIcon icon={faMicrophone} />
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
        <div className="button-group">
          <button onClick={onClose} className="cancel-button">
            취소
          </button>
          <button onClick={handleSave} className="save-button">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;

let isRecognitionActive = false; // 음성 인식 상태를 추적

export const startSpeechRecognition = (onResult, onError) => {
  if (isRecognitionActive) {
    console.warn('음성 인식이 이미 진행 중입니다.');
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'ko-KR'; // 한국어로 인식
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  isRecognitionActive = true; // 음성 인식 활성화
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    onResult(transcript);
    isRecognitionActive = false; // 음성 인식이 종료되면 비활성화
  };

  recognition.onerror = (event) => {
    onError(event.error); // 에러 발생 시 처리 함수 호출
    isRecognitionActive = false;
  };

  recognition.onend = () => {
    isRecognitionActive = false;
  };
};

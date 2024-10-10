let isRecognitionActive = false; // ���� �ν� ���¸� ����

export const startSpeechRecognition = (onResult, onError) => {
  if (isRecognitionActive) {
    console.warn('���� �ν��� �̹� ���� ���Դϴ�.');
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'ko-KR'; // �ѱ���� �ν�
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  isRecognitionActive = true; // ���� �ν� Ȱ��ȭ
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    onResult(transcript);
    isRecognitionActive = false; // ���� �ν��� ����Ǹ� ��Ȱ��ȭ
  };

  recognition.onerror = (event) => {
    onError(event.error); // ���� �߻� �� ó�� �Լ� ȣ��
    isRecognitionActive = false;
  };

  recognition.onend = () => {
    isRecognitionActive = false;
  };
};

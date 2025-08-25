import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MicOff, Volume2, Upload, Send, Loader2, MessageSquare } from 'lucide-react';

const VisionVoiceFeature = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('image');
  const [chatInput, setChatInput] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const FLASK_BASE_URL = 'http://localhost:5000';

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result);
          stopCamera();
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.8);
    }
  };

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze image with Gemini
  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}/analyze-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          prompt: transcript || chatInput || 'Analyze this image for healthcare insights'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResponse(data.analysis);
        // Optional: Convert response to speech
        speakText(data.analysis);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResponse('Failed to analyze image. Please try again.');
    }
    setIsLoading(false);
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        await sendAudioToFlask(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send audio to Flask for speech-to-text
  const sendAudioToFlask = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch(`${FLASK_BASE_URL}/speech-to-text`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        setTranscript(data.text);
        setChatInput(data.text); // Also set it in chat input
        
        // Auto-process based on current mode
        if (currentMode === 'image' && selectedImage) {
          // If in image mode and image is selected, analyze automatically
          await analyzeImage();
        } else if (currentMode === 'chat') {
          // If in chat mode, don't auto-send, just populate the input
          // User can review and then click send
        }
      } else {
        setTranscript(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscript('Failed to process audio. Please try again.');
    }
    setIsLoading(false);
  };

  // Text-to-speech
  const speakText = async (text) => {
    try {
      const response = await fetch(`${FLASK_BASE_URL}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.success) {
        const audio = new Audio(data.audio);
        audio.play();
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  // Chat with Gemini
  const sendChatMessage = async () => {
    const messageToSend = chatInput.trim();
    if (!messageToSend) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${FLASK_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResponse(data.response);
        speakText(data.response);
        setChatInput(''); // Clear input after sending
        setTranscript(''); // Clear transcript too
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setResponse('Failed to get response. Please try again.');
    }
    setIsLoading(false);
  };

  // Handle manual text input change
  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
    setTranscript(e.target.value); // Keep transcript in sync
  };

  // Handle Enter key in chat input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (mediaRecorderRef.current && isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Vision + Voice Healthcare Assistant</h2>
        <p className="text-gray-600">Upload images, speak your questions, and get AI-powered healthcare insights</p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setCurrentMode('image')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentMode === 'image' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            <Camera className="inline mr-2 w-4 h-4" />
            Vision
          </button>
          <button
            onClick={() => setCurrentMode('voice')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentMode === 'voice' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            <Mic className="inline mr-2 w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => setCurrentMode('chat')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentMode === 'chat' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            <MessageSquare className="inline mr-2 w-4 h-4" />
            Chat
          </button>
        </div>
      </div>

      {/* Image Mode */}
      {currentMode === 'image' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
            {!selectedImage ? (
              <div className="text-center">
                {streamRef.current ? (
                  <div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
                    <button
                      onClick={capturePhoto}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Camera className="inline mr-2 w-4 h-4" />
                      Capture Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={startCamera}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Camera className="inline mr-2 w-4 h-4" />
                        Start Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <Upload className="inline mr-2 w-4 h-4" />
                        Upload Image
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <img src={selectedImage} alt="Selected" className="w-full max-w-md mx-auto rounded-lg" />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={analyzeImage}
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="inline mr-2 w-4 h-4 animate-spin" /> : <Send className="inline mr-2 w-4 h-4" />}
                    Analyze Image
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Voice Mode */}
      {currentMode === 'voice' && (
        <div className="bg-white rounded-lg border p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Voice Interaction</h3>
          <p className="text-gray-600">Click the microphone to start recording your question</p>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`px-8 py-4 rounded-lg text-lg transition-colors disabled:opacity-50 ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isRecording ? <MicOff className="inline mr-3 w-6 h-6" /> : <Mic className="inline mr-3 w-6 h-6" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          {transcript && (
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-600 mb-2">Your question:</p>
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Mode */}
      {currentMode === 'chat' && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Chat with AI Assistant</h3>
          <p className="text-gray-600">Type your question or use voice input, then click send</p>
          
          <div className="flex space-x-2">
            <textarea
              value={chatInput}
              onChange={handleChatInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your healthcare question here or use voice input..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={sendChatMessage}
              disabled={isLoading || !chatInput.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 self-end"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isRecording ? <MicOff className="inline mr-2 w-4 h-4" /> : <Mic className="inline mr-2 w-4 h-4" />}
              {isRecording ? 'Stop Voice Input' : 'Use Voice Input'}
            </button>
          </div>
        </div>
      )}

      {/* Voice Input Section - Universal for all modes */}
      {currentMode !== 'voice' && currentMode !== 'chat' && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <h3 className="text-lg font-semibold">Voice Input</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg transition-colors disabled:opacity-50 ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRecording ? <MicOff className="inline mr-2 w-5 h-5" /> : <Mic className="inline mr-2 w-5 h-5" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
          
          {transcript && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Transcript:</p>
              <p className="text-gray-800">{transcript}</p>
            </div>
          )}
        </div>
      )}

      {/* Response Section */}
      {response && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">AI Response</h3>
            <button
              onClick={() => speakText(response)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap">{response}</div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <Loader2 className="inline w-6 h-6 animate-spin text-blue-500" />
          <p className="text-gray-600 mt-2">Processing your request...</p>
        </div>
      )}
    </div>
  );
};

const visionVoiceFeature = {
  title: "Vision + Voice Healthcare Assistant",
  description: "AI-powered image analysis and voice interaction for healthcare",
  component: VisionVoiceFeature,
  features: [
    "Image Analysis with Gemini AI",
    "Voice-to-Text Recognition", 
    "Text-to-Speech Response",
    "Real-time Camera Capture",
    "Healthcare-focused AI Chat"
  ]
};

export default visionVoiceFeature;
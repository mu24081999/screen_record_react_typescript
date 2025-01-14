import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { voiceCommandManager } from '../../lib/voice-commands';
import { Button } from '../ui/Button';

export function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);

  const handleToggle = () => {
    if (isListening) {
      voiceCommandManager.stopListening();
      setIsListening(false);
    } else {
      voiceCommandManager.startListening();
      setIsListening(true);
    }
  };

  if (!voiceCommandManager.isSupported()) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className={`fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full p-0 ${
        isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''
      }`}
    >
      {isListening ? (
        <MicOff className="h-6 w-6 animate-pulse" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
}
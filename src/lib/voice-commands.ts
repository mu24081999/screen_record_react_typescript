import toast from 'react-hot-toast';

type CommandHandler = () => void;

interface VoiceCommand {
  keywords: string[];
  handler: CommandHandler;
  description: string;
}

class VoiceCommandManager {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [];

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', command);
      this.handleCommand(command);
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
      toast.error('Voice command failed');
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  private handleCommand(command: string) {
    for (const { keywords, handler } of this.commands) {
      if (keywords.some(keyword => command.includes(keyword.toLowerCase()))) {
        handler();
        toast.success(`Executing: ${command}`);
        return;
      }
    }
    toast.error('Command not recognized');
  }

  startListening() {
    if (!this.recognition) {
      toast.error('Voice recognition not supported');
      return;
    }

    if (this.isListening) return;

    try {
      this.recognition.start();
      this.isListening = true;
      toast.success('Listening for commands...');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast.error('Failed to start voice recognition');
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }

  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window;
  }
}

export const voiceCommandManager = new VoiceCommandManager();
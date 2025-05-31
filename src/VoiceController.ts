// Voice recognition controller for natural singing commands
export class VoiceController {
    private recognition: any = null;
    private isListening: boolean = false;
    private onCommandCallback: (command: string, transcript: string) => void;

    constructor(onCommand: (command: string, transcript: string) => void) {
        this.onCommandCallback = onCommand;
        this.setupVoiceRecognition();
    }

    private setupVoiceRecognition(): void {
        // Check for browser compatibility
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('🎤 Speech recognition not supported in this browser.');
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event: any) => {
            const originalTranscript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            
            // Clean transcript by removing common articles and filler words
            const cleanedTranscript = originalTranscript
                .replace(/\b(the|a|an|please|can|you|could|would)\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            console.log('🎤 Voice input:', originalTranscript, '-> cleaned:', cleanedTranscript);
            
            // 🎵 MUSICAL INTENSITY DETECTION! Count repeated "dance" words for bigger parties!
            const danceMatches = (originalTranscript.match(/dance/g) || []).length;
            const partyMatches = (originalTranscript.match(/party/g) || []).length;
            
            // If they said "dance" multiple times and mentioned "party", trigger musical intensity!
            if (danceMatches >= 2 && partyMatches >= 1) {
                const intensity = Math.min(danceMatches, 5); // Cap at 5 for sanity
                console.log(`🎤 🎵 MUSICAL INTENSITY DETECTED! ${danceMatches} dances = ${intensity}x party!`);
                this.onCommandCallback('musical_dance_party', originalTranscript);
                return;
            }
            
            // Standard command recognition
            const commands = ['clear dance floor', 'dance party', 'restart the party'];
            const sortedCommands = commands.sort((a, b) => b.length - a.length);
            
            // Try exact matching first on cleaned transcript
            for (const command of sortedCommands) {
                if (cleanedTranscript === command || cleanedTranscript.endsWith(command)) {
                    this.onCommandCallback(command, originalTranscript);
                    return;
                }
            }
            
            // Try exact matching on original transcript
            for (const command of sortedCommands) {
                if (originalTranscript === command || originalTranscript.endsWith(command)) {
                    this.onCommandCallback(command, originalTranscript);
                    return;
                }
            }
            
            // Fallback to includes matching
            for (const command of sortedCommands) {
                if (cleanedTranscript.includes(command) || originalTranscript.includes(command)) {
                    this.onCommandCallback(command, originalTranscript);
                    return;
                }
            }
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceIndicator(false);
            console.log('🎤 Voice recognition stopped.');
            // Auto-restart unless explicitly stopped
            setTimeout(() => {
                if (!this.isListening) {
                    this.startListening();
                }
            }, 1000);
        };
        
        this.recognition.onerror = (event: any) => {
            console.warn('🎤 Voice recognition error:', event.error);
            this.updateVoiceIndicator(false);
            if (event.error === 'not-allowed') {
                console.warn('🎤 Microphone access denied. Voice commands disabled.');
                return;
            }
            // Try to restart on other errors
            setTimeout(() => {
                if (!this.isListening) {
                    this.startListening();
                }
            }, 2000);
        };
        
        // Start listening for voice commands
        console.log('🎤 Setting up voice recognition...');
        this.startListening();
    }

    private startListening(): void {
        if (this.recognition && !this.isListening) {
            try {
                this.isListening = true;
                this.recognition.start();
                console.log('🎤 Voice recognition started! Try singing: "dance party", "clear dance floor", or "restart the party"');
                this.updateVoiceIndicator(true);
            } catch (error) {
                console.warn('🎤 Failed to start voice recognition:', error);
                this.isListening = false;
                this.updateVoiceIndicator(false);
            }
        }
    }

    private updateVoiceIndicator(listening: boolean): void {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            if (listening) {
                indicator.classList.add('listening');
            } else {
                indicator.classList.remove('listening');
            }
        }
    }

    public getDanceIntensity(transcript: string): number {
        const danceMatches = (transcript.match(/dance/g) || []).length;
        return Math.min(danceMatches, 5);
    }
}
